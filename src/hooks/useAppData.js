import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CONSTANTS } from '../utils/constants';
import activitiesCsv from '../data/tabla_actividades_pgoedf.csv?raw';
import cdmxGeoRaw from '../data/cdmx.geojson?raw';
import scGeoRaw from '../data/suelo-de-conservacion-2020.geojson?raw';
import alcaldiasGeoRaw from '../data/alcaldias.geojson?raw';

const useAppData = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataCache, setDataCache] = useState({
        cdmx: null,
        alcaldias: null,
        sc: null,
        edomex: null,
        morelos: null,
        zoning: null,
        anpInternal: null,
        anp: null,
        rules: null
    });

    useEffect(() => {
        const loadData = async () => {
            // Helper to merge features
            const mergeFeatures = (list) => {
                const out = { type: 'FeatureCollection', features: [] };
                (list || []).forEach(fc => {
                    if (fc?.features?.length) out.features.push(...fc.features);
                });
                return out;
            };

            try {
                // 1. Critical Data - Imported Statically (Instant Load)
                // Parse raw JSON strings
                setDataCache(prev => ({
                    ...prev,
                    cdmx: JSON.parse(cdmxGeoRaw),
                    alcaldias: JSON.parse(alcaldiasGeoRaw),
                    sc: JSON.parse(scGeoRaw)
                }));
                setLoading(false);

                // 2. Background Data - Dynamic Imports (Lazy Loaded Chunks)
                try {
                    // Parse Rules
                    const rulesParsed = Papa.parse(activitiesCsv, { header: true, skipEmptyLines: true });
                    const rules = rulesParsed?.data || [];
                    if (rulesParsed?.errors?.length) console.warn("CSV Parse Warnings:", rulesParsed.errors);

                    // Dynamic Importer using Vite's import.meta.glob
                    const geojsonGlobs = import.meta.glob('../data/*.geojson', { query: '?raw', import: 'default' });

                    const loadGeo = async (filename) => {
                        const path = `../data/${filename}`;
                        const loader = geojsonGlobs[path];
                        if (!loader) {
                            console.warn(`GeoJSON not found: ${filename}`);
                            return { type: 'FeatureCollection', features: [] };
                        }
                        const raw = await loader();
                        return JSON.parse(raw);
                    };

                    const [mainZoning, anpInternalList, edomex, morelos, anp] = await Promise.all([
                        loadGeo('zoonificacion_pgoedf_2000_sin_anp.geojson'),
                        Promise.all([
                            loadGeo('Zon_Bosque_de_Tlalpan.geojson'),
                            loadGeo('Zon_Cerro_de_la_Estrella.geojson'),
                            loadGeo('Zon_Desierto_de_los_Leones.geojson'),
                            loadGeo('Zon_Ejidos_de_Xochimilco.geojson'),
                            loadGeo('Zon_La_Loma.geojson'),
                            loadGeo('Zon_Sierra_de_Guadalupe.geojson'),
                            loadGeo('Zon_Sierra_de_Santa_Catarina.geojson')
                        ]),
                        loadGeo('edomex.geojson'),
                        loadGeo('morelos.geojson'),
                        loadGeo('anp_consolidada.geojson')
                    ]);

                    setDataCache(prev => ({
                        ...prev,
                        zoning: mainZoning,
                        anpInternal: mergeFeatures(anpInternalList),
                        rules,
                        edomex,
                        morelos,
                        anp
                    }));
                } catch (bgErr) {
                    console.error("Secondary Data Load Error:", bgErr);
                }

            } catch (err) {
                console.error("Critical Data Load Error:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { loading, error, dataCache, constants: CONSTANTS };
};

export default useAppData;
