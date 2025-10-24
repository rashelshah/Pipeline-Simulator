import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimulationResult, getStageColor, getStageLabel, Stage } from "@/utils/pipelineSimulator";
import { cn } from "@/lib/utils";
import { ControlPanel } from "./ControlPanel";

interface PipelineVisualizationProps {
  result: SimulationResult | null;
}

export function PipelineVisualization({ result }: PipelineVisualizationProps) {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per cycle

  useEffect(() => {
    if (!result) return;
    setCurrentCycle(0);
    setIsPlaying(false);
  }, [result]);

  useEffect(() => {
    if (!isPlaying || !result) return;

    const timer = setInterval(() => {
      setCurrentCycle((prev) => {
        if (prev >= result.cycles - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, result, speed]);

  const handlePlay = () => {
    if (!result) return;
    if (currentCycle >= result.cycles - 1) {
      setCurrentCycle(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (!result) return;
    setCurrentCycle((prev) => Math.min(prev + 1, result.cycles - 1));
  };

  const handleReset = () => {
    setCurrentCycle(0);
    setIsPlaying(false);
  };

  if (!result) {
    return (
      <Card className="h-full flex items-center justify-center border-border/50" style={{ boxShadow: 'var(--shadow-elevated)' }}>
        <CardContent className="text-center p-4 sm:p-6">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Enter instructions and click "Simulate Pipeline" to see the visualization
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col border-border/50" style={{ boxShadow: 'var(--shadow-elevated)' }}>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary">Pipeline Visualization</CardTitle>
            <CardDescription className="text-xs sm:text-sm">5-Stage Pipeline Timeline</CardDescription>
          </div>
          <Badge variant={result.withForwarding ? "default" : "secondary"} className="text-xs sm:text-sm">
            {result.withForwarding ? "With Forwarding" : "No Forwarding"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 sm:gap-4 overflow-hidden">
        <ControlPanel
          currentCycle={currentCycle}
          totalCycles={result.cycles}
          isPlaying={isPlaying}
          speed={speed}
          onPlay={handlePlay}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          onSpeedChange={setSpeed}
        />

        <div className="flex-1 overflow-auto">
          <div className="min-w-max pb-2">
            {/* Legend */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-if" />
                <span className="text-[10px] sm:text-xs font-medium">IF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-id" />
                <span className="text-[10px] sm:text-xs font-medium">ID</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-ex" />
                <span className="text-[10px] sm:text-xs font-medium">EX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-mem" />
                <span className="text-[10px] sm:text-xs font-medium">MEM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-wb" />
                <span className="text-[10px] sm:text-xs font-medium">WB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-stage-stall" />
                <span className="text-[10px] sm:text-xs font-medium">STALL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-stage-forward" />
                <span className="text-[10px] sm:text-xs font-medium">Forwarded</span>
              </div>
            </div>

            {/* Pipeline Grid */}
            <div className="space-y-1.5 sm:space-y-2">
              {/* Header Row */}
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-32 sm:w-40 font-semibold text-[10px] sm:text-xs flex items-center">Instruction</div>
                {Array.from({ length: result.cycles }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-12 sm:w-14 text-center font-semibold text-[10px] sm:text-xs flex items-center justify-center",
                      i === currentCycle && "text-accent"
                    )}
                  >
                    C{i}
                  </div>
                ))}
              </div>

              {/* Instruction Rows */}
              {result.states.map((state, idx) => (
                <div key={idx} className="flex gap-1.5 sm:gap-2 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-32 sm:w-40 text-[10px] sm:text-xs font-mono flex items-center truncate bg-card p-1.5 sm:p-2 rounded border">
                    {state.instruction.name}
                  </div>
                  {state.stages.map((stage, cycleIdx) => {
                    const isCurrentCycle = cycleIdx === currentCycle;
                    const isVisible = cycleIdx <= currentCycle;
                    const isActive = stage !== "-" && isVisible;

                    return (
                      <div
                        key={cycleIdx}
                        className={cn(
                          "w-12 sm:w-14 h-10 sm:h-12 flex items-center justify-center rounded transition-all duration-300 border",
                          getStageColor(stage),
                          isActive && "shadow-md",
                          isCurrentCycle && isActive && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                          state.isForwarded && stage !== "-" && "border-2 border-stage-forward",
                          !isVisible && "opacity-20"
                        )}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold text-white drop-shadow">
                          {isVisible ? getStageLabel(stage) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
