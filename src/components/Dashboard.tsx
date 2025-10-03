import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Thermometer, Droplets, Wind, CloudRain, TrendingUp, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DashboardProps {
  weatherData: any;
  location: { lat: number; lon: number; name: string } | null;
  onExport: () => void;
}

const Dashboard = ({ weatherData, location, onExport }: DashboardProps) => {
  if (!weatherData || !location) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="text-muted-foreground">Select a location and date to see weather analysis</p>
      </div>
    );
  }

  const handleExplainSummary = () => {
    const summaryText = `Temperature Analysis: The mean temperature is ${weatherData.statistics?.temperature?.mean?.toFixed(1) || 'N/A'}°C with a standard deviation of ${weatherData.statistics?.temperature?.stdDev?.toFixed(1) || 'N/A'}°C. Range: ${weatherData.statistics?.temperature?.min?.toFixed(1) || 'N/A'}°C to ${weatherData.statistics?.temperature?.max?.toFixed(1) || 'N/A'}°C. There is a ${((weatherData.probabilities?.highTemperature || 0.35) * 100).toFixed(0)}% probability that temperature will exceed ${weatherData.thresholds?.temperature || 30}°C. Precipitation Probability: ${((weatherData.probabilities?.heavyRain || 0.15) * 100).toFixed(0)}% chance of precipitation exceeding ${weatherData.thresholds?.precipitation || 10}mm. Average rainfall is ${weatherData.statistics?.precipitation?.mean?.toFixed(1) || 'N/A'}mm. Data Source: NASA POWER Project - Powered by NASA's satellite observations and meteorological reanalysis from 2000-2024.`;
    
    // Open chatbot and send the summary for explanation
    const event = new CustomEvent('openChatbot', { detail: { message: `Please explain this weather analysis in simple terms: ${summaryText}` } });
    window.dispatchEvent(event);
  };

  const stats = [
    {
      title: "Temperature",
      value: `${weatherData.statistics?.temperature?.mean?.toFixed(1) || "--"}°C`,
      icon: Thermometer,
      change: "+2.3°C from average",
      trend: "up",
      risk: weatherData.probabilities?.highTemperature > 0.5 ? "high" : weatherData.probabilities?.highTemperature > 0.3 ? "medium" : "low",
    },
    {
      title: "Precipitation",
      value: `${weatherData.statistics?.precipitation?.mean?.toFixed(1) || "--"} mm`,
      icon: Droplets,
      change: "15% chance of rain",
      trend: "down",
      risk: weatherData.probabilities?.heavyRain > 0.3 ? "high" : weatherData.probabilities?.heavyRain > 0.15 ? "medium" : "low",
    },
    {
      title: "Wind Speed",
      value: `${weatherData.statistics?.windSpeed?.mean?.toFixed(1) || "--"} m/s`,
      icon: Wind,
      change: "Light breeze",
      trend: "stable",
      risk: weatherData.probabilities?.highWind > 0.4 ? "high" : weatherData.probabilities?.highWind > 0.2 ? "medium" : "low",
    },
    {
      title: "Humidity",
      value: `${weatherData.statistics?.humidity?.mean?.toFixed(0) || "--"}%`,
      icon: CloudRain,
      change: "Moderate",
      trend: "stable",
      risk: weatherData.probabilities?.highHumidity > 0.6 ? "high" : weatherData.probabilities?.highHumidity > 0.4 ? "medium" : "low",
    },
  ];

  // Sample historical trend data
  const trendData = weatherData.historicalTrend || [
    { year: "2020", temp: 28.5, precip: 8.2 },
    { year: "2021", temp: 29.1, precip: 7.8 },
    { year: "2022", temp: 30.2, precip: 9.1 },
    { year: "2023", temp: 31.0, precip: 8.5 },
    { year: "2024", temp: 30.5, precip: 7.9 },
  ];

  // Sample probability data
  const probabilityData = weatherData.probabilityByMonth || [
    { month: "Jan", probability: 0.15 },
    { month: "Feb", probability: 0.18 },
    { month: "Mar", probability: 0.22 },
    { month: "Apr", probability: 0.28 },
    { month: "May", probability: 0.35 },
    { month: "Jun", probability: 0.42 },
    { month: "Jul", probability: 0.45 },
    { month: "Aug", probability: 0.40 },
    { month: "Sep", probability: 0.32 },
    { month: "Oct", probability: 0.25 },
    { month: "Nov", probability: 0.20 },
    { month: "Dec", probability: 0.16 },
  ];

  return (
    <div className="space-y-6">
      {/* Location Info */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5" style={{ color: 'hsl(45, 90%, 55%)' }} />
          </div>
          <div>
            <h3 className="font-semibold">{location.name}</h3>
            <p className="text-sm text-muted-foreground">
              {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </p>
          </div>
        </div>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`glass-panel border-l-4 ${
              stat.risk === "high" ? "border-danger" :
              stat.risk === "medium" ? "border-warning" :
              "border-success"
            }`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4" style={{ color: 'hsl(45, 90%, 55%)' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                <div className={`mt-2 text-xs font-medium inline-flex items-center px-2 py-1 rounded-full ${
                  stat.risk === "high" ? "risk-high" :
                  stat.risk === "medium" ? "risk-medium" :
                  "risk-low"
                }`}>
                  {stat.risk === "high" ? "High Risk" : stat.risk === "medium" ? "Medium Risk" : "Low Risk"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trend */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: 'hsl(45, 90%, 55%)' }} />
              Historical Trend (5 Years)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(45, 90%, 55%)"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={{ fill: "hsl(45, 90%, 55%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="precip"
                  stroke="hsl(35, 75%, 43%)"
                  strokeWidth={2}
                  name="Precipitation (mm)"
                  dot={{ fill: "hsl(35, 75%, 43%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Probability by Month */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: 'hsl(45, 90%, 55%)' }} />
              Threshold Exceedance Probability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={probabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                />
                <Bar dataKey="probability" fill="hsl(45, 90%, 55%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: 'hsl(45, 90%, 55%)' }} />
              Weather Analysis Summary
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExplainSummary}
              className="text-xs"
            >
              Explain
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed">
            <strong>Temperature:</strong> Based on 20+ years of historical data from NASA POWER, 
            there is a <span className="font-semibold" style={{ color: 'hsl(45, 90%, 55%)' }}>{((weatherData.probabilities?.highTemperature || 0.35) * 100).toFixed(0)}% probability</span> that 
            temperature will exceed {weatherData.thresholds?.temperature || 30}°C on this date at this location. 
            The historical average for this period is {weatherData.statistics?.temperature?.mean?.toFixed(1) || "30.2"}°C.
          </p>
          <p className="text-sm leading-relaxed">
            <strong>Precipitation:</strong> Historical analysis indicates a <span className="font-semibold" style={{ color: 'hsl(35, 75%, 43%)' }}>{((weatherData.probabilities?.heavyRain || 0.15) * 100).toFixed(0)}% chance</span> of 
            precipitation exceeding {weatherData.thresholds?.precipitation || 10}mm. Average rainfall for this date 
            is {weatherData.statistics?.precipitation?.mean?.toFixed(1) || "5.2"}mm.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Data Source:</strong> NASA POWER API (Prediction Of Worldwide Energy Resources) | 
            Analysis Period: 2000-2024 | <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
