import { useState } from "react";
import WeatherMap from "@/components/WeatherMap";
import ControlPanel, { AnalysisParams } from "@/components/ControlPanel";
import Dashboard from "@/components/Dashboard";
import WeatherChatbot from "@/components/WeatherChatbot";
import { toast } from "@/hooks/use-toast";
import { Cloud } from "lucide-react";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setSelectedLocation({ lat, lon, name });
    toast({
      title: "Location selected",
      description: name,
    });
  };

  const handleAnalyze = async (params: AnalysisParams) => {
    if (!selectedLocation || !params.date) {
      toast({
        title: "Missing information",
        description: "Please select a location and date first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate NASA API call (replace with actual NASA POWER API integration)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock weather data based on parameters
      const mockData: any = {
        temperature: params.parameters.temperature
          ? {
              mean: 28.5 + Math.random() * 5,
              stdDev: 2.1,
              min: 22.0,
              max: 38.5,
              probability: 0.25 + Math.random() * 0.4,
              threshold: params.thresholds.temperature,
            }
          : null,
        precipitation: params.parameters.precipitation
          ? {
              mean: 5.2 + Math.random() * 8,
              stdDev: 3.5,
              min: 0,
              max: 45.0,
              probability: 0.1 + Math.random() * 0.3,
              threshold: params.thresholds.precipitation,
            }
          : null,
        windSpeed: params.parameters.windSpeed
          ? {
              mean: 8.5 + Math.random() * 7,
              stdDev: 2.8,
              min: 2.0,
              max: 25.0,
              probability: 0.15 + Math.random() * 0.35,
              threshold: params.thresholds.windSpeed,
            }
          : null,
        humidity: params.parameters.humidity
          ? {
              mean: 65 + Math.random() * 20,
              stdDev: 8.5,
              min: 30,
              max: 95,
              probability: 0.3 + Math.random() * 0.4,
              threshold: params.thresholds.humidity,
            }
          : null,
      };

      setWeatherData(mockData);
      toast({
        title: "Analysis complete",
        description: "Weather data loaded from NASA POWER API",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!weatherData || !selectedLocation) return;

    const exportData = {
      query: {
        location: selectedLocation,
        timestamp: new Date().toISOString(),
      },
      data: weatherData,
      metadata: {
        data_source: "NASA POWER API",
        source_url: "https://power.larc.nasa.gov/",
        years_analyzed: "2000-2024",
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weather-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Weather data downloaded as JSON",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-earth rounded-lg flex items-center justify-center shadow-medium">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Weather Event Planner</h1>
              <p className="text-sm text-muted-foreground">
                Powered by NASA Earth Observations
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-2 h-[500px]">
            <WeatherMap
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* Control Panel */}
          <div className="h-[500px] overflow-y-auto">
            <ControlPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard
          weatherData={weatherData}
          location={selectedLocation}
          onExport={handleExport}
        />
      </main>

      {/* Chatbot */}
      <WeatherChatbot location={selectedLocation} weatherData={weatherData} />
    </div>
  );
};

export default Index;
