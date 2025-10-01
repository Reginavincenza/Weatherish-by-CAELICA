import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WeatherMapProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  selectedLocation: { lat: number; lon: number; name: string } | null;
}

const WeatherMap = ({ onLocationSelect, selectedLocation }: WeatherMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([20, 0], 2);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-strong">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Handle map clicks
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setIsLoading(true);

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      markerRef.current = marker;

      // Reverse geocode to get location name
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
        );
        const data = await response.json();
        const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        onLocationSelect(lat, lng, locationName);
        
        marker.bindPopup(`
          <div class="text-sm">
            <p class="font-semibold">${locationName}</p>
            <p class="text-muted-foreground">Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}</p>
          </div>
        `).openPopup();
      } catch (error) {
        console.error("Geocoding error:", error);
        toast({
          title: "Location selected",
          description: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      map.remove();
    };
  }, [onLocationSelect]);

  // Update marker when selectedLocation changes externally
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const customIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-strong">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`,
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = L.marker([selectedLocation.lat, selectedLocation.lon], {
        icon: customIcon,
      }).addTo(mapRef.current);
      markerRef.current = marker;

      marker.bindPopup(`
        <div class="text-sm">
          <p class="font-semibold">${selectedLocation.name}</p>
          <p class="text-muted-foreground">Lat: ${selectedLocation.lat.toFixed(4)}, Lon: ${selectedLocation.lon.toFixed(4)}</p>
        </div>
      `);

      mapRef.current.setView([selectedLocation.lat, selectedLocation.lon], 8);
    }
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-medium">
      <div ref={mapContainerRef} className="h-full w-full" />
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card px-4 py-2 rounded-lg shadow-medium flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-sm font-medium">Locating...</span>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-card px-4 py-2 rounded-lg shadow-medium">
        <p className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Click anywhere to select location
        </p>
      </div>
    </div>
  );
};

export default WeatherMap;
