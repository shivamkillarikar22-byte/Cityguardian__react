import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: 'Fetching location...',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          setLocation({
            latitude,
            longitude,
            address,
            loading: false,
            error: null
          });
        } catch (err) {
          setLocation({
            latitude,
            longitude,
            address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            loading: false,
            error: null
          });
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Location permission denied. Please enable GPS for accurate reporting.'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return location;
};

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`;
  }
}
