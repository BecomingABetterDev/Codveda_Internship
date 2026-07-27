// src/features/search/hooks/useGeocoding.js
// Purpose: handle search input for locations with debounce, caching, and error states

import { useState, useEffect, useRef } from 'react';
import { getGeocoding } from '../../../shared/services/api';

export function useGeocoding(query) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cache results to avoid repeated API calls
    const cache = useRef(new Map());
    // Track active request to abort if needed
    const controllerRef = useRef(null);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setData([]);
            setError(null);
            return;
        }

        // Debounce: wait 400ms after typing stops
        const handler = setTimeout(async() => {
            // If cached, return immediately
            if (cache.current.has(query)) {
                setData(cache.current.get(query));
                return;
            }

            // Abort previous request if still running
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                const results = await getGeocoding(query, { signal: controllerRef.current.signal });
                cache.current.set(query, results);
                setData(results);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Unknown error');
                }
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [query]);

    return { data, loading, error };
}