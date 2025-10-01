import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WeatherMap from "@/components/WeatherMap";
import ControlPanel, { AnalysisParams } from "@/components/ControlPanel";
import { useToast } from "@/hooks/use-toast";

interface Location {
  lat: number;
  lon: number;
  name: string;
}

const QueryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    const location = { lat, lon, name };
    setSelectedLocation(location);
    toast({
      title: "Location Selected",
      description: `${name} (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    });
  };

  const handleAnalyze = async (params: AnalysisParams) => {
    if (!selectedLocation) {
      toast({
        title: "No Location Selected",
        description: "Please select a location on the map first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Analyzing Weather Data",
      description: "Fetching NASA Earth observations...",
    });

    // Simulate API call delay
    setTimeout(() => {
      // Convert parameters object to array of selected params
      const selectedParams = Object.entries(params.parameters)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => key);

      // Mock weather data
      const mockWeatherData = {
        location: selectedLocation,
        date: params.date,
        parameters: selectedParams,
        statistics: {
          temperature: {
            mean: 28.5,
            stdDev: 3.2,
            min: 22.1,
            max: 35.8,
            unit: "°C",
          },
          precipitation: {
            mean: 5.2,
            stdDev: 8.1,
            min: 0,
            max: 45.3,
            unit: "mm",
          },
          windSpeed: {
            mean: 12.3,
            stdDev: 4.5,
            min: 3.2,
            max: 28.7,
            unit: "m/s",
          },
          humidity: {
            mean: 65.5,
            stdDev: 12.3,
            min: 35.2,
            max: 95.8,
            unit: "%",
          },
        },
        probabilities: {
          highTemperature: 0.35,
          heavyRain: 0.12,
          highWind: 0.08,
          highHumidity: 0.28,
        },
        historicalData: Array.from({ length: 20 }, (_, i) => ({
          year: 2004 + i,
          temperature: 25 + Math.random() * 10,
          precipitation: Math.random() * 30,
          windSpeed: 8 + Math.random() * 15,
        })),
      };

      setIsLoading(false);
      toast({
        title: "Analysis Complete",
        description: "Weather data retrieved successfully!",
      });

      // Navigate to results page with data
      navigate("/results", { state: { weatherData: mockWeatherData } });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - relative positioning so it scrolls */}
      <header className="relative z-10 bg-gradient-primary text-white shadow-strong">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold">Weatherish</h1>
          <p className="text-white/90 mt-2">NASA Earth Observations for Event Planning</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 mb-8">
          {/* Map Section */}
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Select Location</h2>
            <WeatherMap
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Control Panel */}
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Weather Parameters</h2>
            <ControlPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueryPage;
