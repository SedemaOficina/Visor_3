import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CONSTANTS } from '../utils/constants';
import activitiesCsv from '../data/tabla_actividades_pgoedf.csv?raw';

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
            const { DATA_FILES } = CONSTANTS;

            const fetchJson = async (u) => {
                try {
                    if (!u) return { type: "FeatureCollection", features: [] };
                    const cleanPath = u.replace(/^\.\//, '/');
                    const res = await fetch(cleanPath, { cache: 'no-store' });
                    if (!res.ok) throw new Error(`HTTP ${res.status} ${cleanPath}`);
                    return await res.json();
                } catch (e) {
                    console.warn('Error loading JSON:', u, e);
                    return { type: "FeatureCollection", features: [] };
                }
            };

            // Helper to merge features
            const mergeFeatures = (list) => {
                const out = { type: 'FeatureCollection', features: [] };
                (list || []).forEach(fc => {
                    if (fc?.features?.length) out.features.push(...fc.features);
                });
                return out;
            };

            try {
                // 1. Critical Data (Map Boundaries & Context) - Blocking Initial Render
                const [cdmx, alcaldias, sc] = await Promise.all([
                    fetchJson(DATA_FILES.LIMITES_CDMX),
                    fetchJson(DATA_FILES.LIMITES_ALCALDIAS),
                    fetchJson(DATA_FILES.SUELO_CONSERVACION)
                ]);

                // Render Map ASAP
                setDataCache(prev => ({ ...prev, cdmx, alcaldias, sc }));
                setLoading(false);

                // 2. Background Data (Heavy Layers & Analysis Data) - Lazy Loaded
                try {
                    // Parse Rules Synchronously from imported file
                    const rulesParsed = Papa.parse(activitiesCsv, { header: true, skipEmptyLines: true });
                    const rules = rulesParsed?.data || [];
                    if (rulesParsed?.errors?.length) console.warn("CSV Parse Warnings:", rulesParsed.errors);

                    const [mainZoning, anpInternalList, edomex, morelos, anp] = await Promise.all([
                        fetchJson(DATA_FILES.ZONIFICACION_MAIN),
                        Promise.all((DATA_FILES.ZONIFICACION_FILES || []).map(fetchJson)),
                        fetchJson(DATA_FILES.LIMITES_EDOMEX),
                        fetchJson(DATA_FILES.LIMITES_MORELOS),
                        fetchJson(DATA_FILES.ANP)
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
                    // Don't block app, just log
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
