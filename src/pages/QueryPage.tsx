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
      description: "Fetching NASA POWER data...",
    });

    try {
      // Convert parameters object to array of selected params
      const selectedParams = Object.entries(params.parameters)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => key);

      // Map UI parameters to NASA POWER API parameters
      const paramMap: Record<string, string> = {
        temperature: 'T2M',
        precipitation: 'PRECTOTCORR',
        windSpeed: 'WS2M',
        humidity: 'RH2M'
      };

      const nasaParams = selectedParams.map(p => paramMap[p]).filter(Boolean).join(',');

      // Build NASA POWER API request
      const startDate = '20040101';
      const endDate = '20241231';
      const apiUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${nasaParams}&community=RE&longitude=${selectedLocation.lon}&latitude=${selectedLocation.lat}&start=${startDate}&end=${endDate}&format=JSON`;

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NASA POWER data');
      }

      const data = await response.json();
      const parameterData = data.properties.parameter;

      // Process NASA data into our format
      const processParameter = (nasaKey: string, unit: string) => {
        const values = Object.values(parameterData[nasaKey] || {}).filter((v): v is number => typeof v === 'number' && v > -999);
        if (values.length === 0) return null;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        return {
          mean: Number(mean.toFixed(2)),
          stdDev: Number(stdDev.toFixed(2)),
          min: Number(Math.min(...values).toFixed(2)),
          max: Number(Math.max(...values).toFixed(2)),
          unit
        };
      };

      // Calculate probabilities based on thresholds
      const calculateProbability = (nasaKey: string, threshold: number) => {
        const values = Object.values(parameterData[nasaKey] || {}).filter((v): v is number => typeof v === 'number' && v > -999);
        if (values.length === 0) return 0;
        const exceedCount = values.filter(v => v > threshold).length;
        return Number((exceedCount / values.length).toFixed(3));
      };

      // Build statistics object
      const statistics: any = {};
      const probabilities: any = {};

      if (selectedParams.includes('temperature') && parameterData.T2M) {
        statistics.temperature = processParameter('T2M', '°C');
        probabilities.highTemperature = calculateProbability('T2M', params.thresholds.temperature || 30);
      }
      if (selectedParams.includes('precipitation') && parameterData.PRECTOTCORR) {
        statistics.precipitation = processParameter('PRECTOTCORR', 'mm');
        probabilities.heavyRain = calculateProbability('PRECTOTCORR', params.thresholds.precipitation || 10);
      }
      if (selectedParams.includes('windSpeed') && parameterData.WS2M) {
        statistics.windSpeed = processParameter('WS2M', 'm/s');
        probabilities.highWind = calculateProbability('WS2M', params.thresholds.windSpeed || 15);
      }
      if (selectedParams.includes('humidity') && parameterData.RH2M) {
        statistics.humidity = processParameter('RH2M', '%');
        probabilities.highHumidity = calculateProbability('RH2M', params.thresholds.humidity || 70);
      }

      // Create historical data array
      const years = Object.keys(parameterData[nasaParams.split(',')[0]] || {})
        .map(dateStr => Math.floor(parseInt(dateStr) / 10000))
        .filter((year, idx, arr) => arr.indexOf(year) === idx)
        .sort();

      const historicalData = years.map(year => {
        const yearData: any = { year };
        
        if (parameterData.T2M) {
          const yearValues = Object.entries(parameterData.T2M)
            .filter(([date]) => date.startsWith(String(year)))
            .map(([_, val]) => val as number)
            .filter(v => v > -999);
          yearData.temperature = yearValues.length > 0 
            ? yearValues.reduce((a, b) => a + b, 0) / yearValues.length 
            : 0;
        }
        
        if (parameterData.PRECTOTCORR) {
          const yearValues = Object.entries(parameterData.PRECTOTCORR)
            .filter(([date]) => date.startsWith(String(year)))
            .map(([_, val]) => val as number)
            .filter(v => v > -999);
          yearData.precipitation = yearValues.length > 0 
            ? yearValues.reduce((a, b) => a + b, 0) / yearValues.length 
            : 0;
        }
        
        if (parameterData.WS2M) {
          const yearValues = Object.entries(parameterData.WS2M)
            .filter(([date]) => date.startsWith(String(year)))
            .map(([_, val]) => val as number)
            .filter(v => v > -999);
          yearData.windSpeed = yearValues.length > 0 
            ? yearValues.reduce((a, b) => a + b, 0) / yearValues.length 
            : 0;
        }
        
        return yearData;
      });

      const weatherData = {
        location: selectedLocation,
        date: params.date,
        parameters: selectedParams,
        statistics,
        probabilities,
        historicalData,
      };

      setIsLoading(false);
      toast({
        title: "Analysis Complete",
        description: "Weather data retrieved successfully!",
      });

      // Navigate to results page with data
      navigate("/results", { state: { weatherData } });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
      console.error("NASA API Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - relative positioning so it scrolls */}
      <header className="relative z-10 bg-gradient-primary/60 shadow-strong">
        <div className="container mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(45,90%,55%)] to-[hsl(270,60%,50%)] bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 20px hsl(220, 80%, 50%))' }}>Weatherish</h1>
          <p className="text-secondary mt-2">NASA Earth Observations for Event Planning</p>
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
