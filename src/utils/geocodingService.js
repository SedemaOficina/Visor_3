/**
 * Servicio de Geocodificación Inversa usando Mapbox
 * 
 * Docs: https://docs.mapbox.com/api/search/geocoding/
 */

export const getReverseGeocoding = async (lat, lng, apiKey) => {
    if (!apiKey) {
        console.warn("Mapbox API Key no configurada.");
        return null;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address,poi&language=es&access_token=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching address');

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            // Retornamos la dirección más relevante
            return data.features[0].place_name;
        }

        return null;
    } catch (error) {
        console.error("Error en geocodificación:", error);
        return null;
    }
};
