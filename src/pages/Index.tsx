import { useState } from "react";
import { InstructionInput } from "@/components/InstructionInput";
import { PipelineVisualization } from "@/components/PipelineVisualization";
import { parseInstruction, simulatePipeline, SimulationResult } from "@/utils/pipelineSimulator";
import { toast } from "sonner";
import { Cpu } from "lucide-react";

const Index = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleSimulate = (instructionLines: string[], withForwarding: boolean) => {
    const instructions = instructionLines
      .map(parseInstruction)
      .filter((instr) => instr !== null);

    if (instructions.length === 0) {
      toast.error("No valid instructions found", {
        description: "Please enter at least one valid instruction",
      });
      return;
    }

    const result = simulatePipeline(instructions, withForwarding);
    setSimulationResult(result);

    toast.success("Pipeline simulation complete", {
      description: `Simulated ${instructions.length} instructions over ${result.cycles} cycles`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-10" style={{ boxShadow: 'var(--shadow-elevated)' }}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-primary">Interactive Pipeline Simulator</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                5-Stage CPU Pipeline Visualization Tool
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-180px)]">
          {/* Left Panel - Input */}
          <div className="h-auto lg:h-full">
            <InstructionInput onSimulate={handleSimulate} />
          </div>

          {/* Right Panel - Visualization */}
          <div className="h-auto lg:h-full">
            <PipelineVisualization result={simulationResult} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
