/**
 * Generic fetch wrapper with timeout + error handling
 */
export async function fetchWithTimeout(url, { timeout = 8000, signal } = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(url, { signal: signal || controller.signal });
        clearTimeout(id);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        // Normalize error messages
        throw new Error(err.name === 'AbortError' ? 'Request timed out' : err.message);
    }
}

/**
 * Geocoding API — search for location by name
 * Returns array of { name, country, lat, lon }
 */
export async function getGeocoding(query) {
    if (!query || query.trim().length === 0) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

    const data = await fetchWithTimeout(url);

    return (data.results || []).map((loc) => ({
        name: loc.name,
        country: loc.country,
        lat: loc.latitude,
        lon: loc.longitude,
    }));
}

/**
 * Weather API — fetch forecast for given lat/lon
 * Returns normalized object with current + hourly + daily
 */
export async function getWeather(lat, lon, units = 'metric') {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windUnit = units === 'imperial' ? 'mph' : 'kmh';

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=${tempUnit}&windspeed_unit=${windUnit}&timezone=auto`;

    const data = await fetchWithTimeout(url);

    return {
        current: data.current_weather || {},
        hourly: data.hourly || {},
        daily: data.daily || {},
    };
}