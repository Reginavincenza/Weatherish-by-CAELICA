import { useState } from "react";
import { Calendar, Droplets, Wind, Thermometer, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface ControlPanelProps {
  onAnalyze: (params: AnalysisParams) => void;
  isLoading: boolean;
}

export interface AnalysisParams {
  date: Date | undefined;
  parameters: {
    temperature: boolean;
    precipitation: boolean;
    windSpeed: boolean;
    humidity: boolean;
  };
  thresholds: {
    temperature?: number;
    precipitation?: number;
    windSpeed?: number;
    humidity?: number;
  };
}

const ControlPanel = ({ onAnalyze, isLoading }: ControlPanelProps) => {
  const [date, setDate] = useState<Date>();
  const [parameters, setParameters] = useState({
    temperature: true,
    precipitation: true,
    windSpeed: false,
    humidity: false,
  });
  const [thresholds, setThresholds] = useState({
    temperature: 30,
    precipitation: 10,
    windSpeed: 15,
    humidity: 80,
  });

  const handleAnalyze = () => {
    onAnalyze({ date, parameters, thresholds });
  };

  const parameterOptions = [
    { key: "temperature" as const, label: "Temperature", icon: Thermometer, unit: "°C" },
    { key: "precipitation" as const, label: "Precipitation", icon: Droplets, unit: "mm" },
    { key: "windSpeed" as const, label: "Wind Speed", icon: Wind, unit: "m/s" },
    { key: "humidity" as const, label: "Humidity", icon: CloudRain, unit: "%" },
  ];

  return (
    <div className="glass-panel p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Analysis Parameters</h2>
        
        {/* Date Selector */}
        <div className="space-y-2 mb-6">
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Parameters */}
        <div className="space-y-4 mb-6">
          <Label>Weather Parameters</Label>
          {parameterOptions.map(({ key, label, icon: Icon, unit }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={parameters[key]}
                  onCheckedChange={(checked) =>
                    setParameters((prev) => ({ ...prev, [key]: checked as boolean }))
                  }
                />
                <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                  <Icon className="w-4 h-4" />
                  {label}
                </Label>
              </div>
              {parameters[key] && (
                <div className="ml-6 flex items-center gap-2">
                  <Label htmlFor={`${key}-threshold`} className="text-sm text-muted-foreground">
                    Threshold:
                  </Label>
                  <Input
                    id={`${key}-threshold`}
                    type="number"
                    value={thresholds[key]}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">{unit}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !date}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
              Analyzing...
            </>
          ) : (
            "Analyze Weather"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
