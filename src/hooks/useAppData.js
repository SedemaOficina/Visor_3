import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CONSTANTS } from '../utils/constants';
import activitiesCsv from '../data/tabla_actividades_pgoedf.csv?raw';
import cdmxGeo from '../data/cdmx.geojson';
import scGeo from '../data/suelo-de-conservacion-2020.geojson';
import alcaldiasGeo from '../data/alcaldias.geojson';

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
                setDataCache(prev => ({
                    ...prev,
                    cdmx: cdmxGeo,
                    alcaldias: alcaldiasGeo,
                    sc: scGeo
                }));
                setLoading(false);

                // 2. Background Data - Dynamic Imports (Lazy Loaded Chunks)
                try {
                    // Parse Rules
                    const rulesParsed = Papa.parse(activitiesCsv, { header: true, skipEmptyLines: true });
                    const rules = rulesParsed?.data || [];
                    if (rulesParsed?.errors?.length) console.warn("CSV Parse Warnings:", rulesParsed.errors);

                    const [mainZoning, anpInternalList, edomex, morelos, anp] = await Promise.all([
                        import('../data/zoonificacion_pgoedf_2000_sin_anp.geojson').then(m => m.default),
                        Promise.all([
                            import('../data/Zon_Bosque_de_Tlalpan.geojson').then(m => m.default),
                            import('../data/Zon_Cerro_de_la_Estrella.geojson').then(m => m.default),
                            import('../data/Zon_Desierto_de_los_Leones.geojson').then(m => m.default),
                            import('../data/Zon_Ejidos_de_Xochimilco.geojson').then(m => m.default),
                            import('../data/Zon_La_Loma.geojson').then(m => m.default),
                            import('../data/Zon_Sierra_de_Guadalupe.geojson').then(m => m.default),
                            import('../data/Zon_Sierra_de_Santa_Catarina.geojson').then(m => m.default)
                        ]),
                        import('../data/edomex.geojson').then(m => m.default),
                        import('../data/morelos.geojson').then(m => m.default),
                        import('../data/anp_consolidada.geojson').then(m => m.default)
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
