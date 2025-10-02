import { useLocation, useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import earthBackground from "@/assets/earth-background.jpg";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const weatherData = location.state?.weatherData;

  if (!weatherData) {
    navigate("/");
    return null;
  }

  const handleExport = () => {
    const exportData = {
      query: {
        location: weatherData.location,
        date: weatherData.date,
        parameters: weatherData.parameters,
      },
      data: weatherData,
      metadata: {
        data_source: "NASA POWER API",
        source_url: "https://power.larc.nasa.gov/",
        query_date: new Date().toISOString(),
        years_analyzed: "2004-2024",
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weatherish-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${earthBackground})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-primary/60 shadow-strong">
        <div className="container mx-auto px-6 py-6 text-center">
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-[hsl(45,90%,55%)] to-[hsl(270,60%,50%)] bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            style={{ filter: 'drop-shadow(0 0 20px hsl(220, 80%, 50%))' }}
            onClick={() => navigate("/")}
          >
            Weatherish
          </h1>
          <p className="text-secondary mt-2">Analysis Results</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <Dashboard 
          weatherData={weatherData} 
          location={weatherData.location}
          onExport={handleExport} 
        />
      </main>
    </div>
  );
};

export default ResultsPage;
