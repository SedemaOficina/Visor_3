import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CONSTANTS } from '../utils/constants';

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
                    // Resolve path relative to public/root if referenced with ./data
                    // In Vite, files in public/data are accessible at /data
                    const cleanPath = u.replace(/^\.\//, '/');
                    const res = await fetch(cleanPath, { cache: 'no-store' });
                    if (!res.ok) throw new Error(`HTTP ${res.status} ${cleanPath}`);
                    return await res.json();
                } catch (e) {
                    console.warn('Error loading JSON:', u, e);
                    return { type: "FeatureCollection", features: [] };
                }
            };

            const fetchCsv = async (u) =>
                new Promise((r) => {
                    const cleanPath = u.replace(/^\.\//, '/');
                    Papa.parse(cleanPath, {
                        download: true,
                        header: true,
                        skipEmptyLines: true,
                        complete: (res) => r(res.data),
                        error: () => r([])
                    })
                });

            // Helper to merge features
            const mergeFeatures = (list) => {
                const out = { type: 'FeatureCollection', features: [] };
                (list || []).forEach(fc => {
                    if (fc?.features?.length) out.features.push(...fc.features);
                });
                return out;
            };

            try {
                const [cdmx, alcaldias, sc, mainZoning, anpInternalList, rules, edomex, morelos, anp] = await Promise.all([
                    fetchJson(DATA_FILES.LIMITES_CDMX),
                    fetchJson(DATA_FILES.LIMITES_ALCALDIAS),
                    fetchJson(DATA_FILES.SUELO_CONSERVACION),
                    fetchJson(DATA_FILES.ZONIFICACION_MAIN),
                    Promise.all((DATA_FILES.ZONIFICACION_FILES || []).map(fetchJson)),
                    fetchCsv(DATA_FILES.USOS_SUELO_CSV),
                    fetchJson(DATA_FILES.LIMITES_EDOMEX),
                    fetchJson(DATA_FILES.LIMITES_MORELOS),
                    fetchJson(DATA_FILES.ANP)
                ]);

                setDataCache({
                    cdmx,
                    alcaldias,
                    sc,
                    zoning: mainZoning,
                    anpInternal: mergeFeatures(anpInternalList),
                    rules,
                    edomex,
                    morelos,
                    anp
                });
                setLoading(false);
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
