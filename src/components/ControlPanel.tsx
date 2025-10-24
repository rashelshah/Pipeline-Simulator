import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ControlPanelProps {
  currentCycle: number;
  totalCycles: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function ControlPanel({
  currentCycle,
  totalCycles,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}: ControlPanelProps) {
  const handleSpeedChange = (value: number[]) => {
    // Convert slider value (0-100) to speed (2000ms-200ms)
    const newSpeed = 2000 - (value[0] * 18);
    onSpeedChange(newSpeed);
  };

  const speedPercentage = ((2000 - speed) / 18);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg border">
      <div className="flex gap-2 justify-center">
        {isPlaying ? (
          <Button onClick={onPause} size="sm" variant="default" className="gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:inline">Pause</span>
          </Button>
        ) : (
          <Button onClick={onPlay} size="sm" variant="default" className="gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="sm:inline">Play</span>
          </Button>
        )}
        <Button onClick={onStep} size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none" disabled={isPlaying}>
          <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Step</span>
        </Button>
        <Button onClick={onReset} size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </div>

      <div className="flex-1 flex items-center gap-2 sm:gap-3">
        <Label className="text-xs sm:text-sm font-medium whitespace-nowrap">Speed:</Label>
        <Slider
          value={[speedPercentage]}
          onValueChange={handleSpeedChange}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-xs sm:text-sm font-mono text-muted-foreground w-12 sm:w-16 text-right">
          {(1000 / speed).toFixed(1)}x
        </span>
      </div>

      <div className="text-xs sm:text-sm font-mono text-center sm:text-left">
        <span className="text-accent font-bold">Cycle {currentCycle}</span>
        <span className="text-muted-foreground"> / {totalCycles - 1}</span>
      </div>
    </div>
  );
}
