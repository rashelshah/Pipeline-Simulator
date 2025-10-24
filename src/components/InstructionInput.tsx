import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";

interface InstructionInputProps {
  onSimulate: (instructions: string[], withForwarding: boolean) => void;
}

const DEFAULT_INSTRUCTIONS = `ADD R1, R2, R3
SUB R4, R1, R5
AND R6, R1, R7
OR R8, R1, R9
LW R10, 0(R1)`;

export function InstructionInput({ onSimulate }: InstructionInputProps) {
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [withForwarding, setWithForwarding] = useState(false);

  const handleSimulate = () => {
    const lines = instructions.split("\n").filter((line) => line.trim());
    onSimulate(lines, withForwarding);
  };

  const handleReset = () => {
    setInstructions(DEFAULT_INSTRUCTIONS);
    setWithForwarding(false);
  };

  return (
    <Card className="h-full flex flex-col border-border/50" style={{ boxShadow: 'var(--shadow-elevated)' }}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary">Instruction Input</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Enter assembly instructions to simulate</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <Label htmlFor="instructions" className="text-xs sm:text-sm font-medium">
            Assembly Instructions
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="flex-1 font-mono text-xs sm:text-sm resize-none min-h-[120px] sm:min-h-[200px]"
            placeholder="ADD R1, R2, R3"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Example formats: ADD R1, R2, R3 | SUB R4, R1, R5 | LW R1, 0(R2)
          </p>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary/50 rounded-lg">
          <div className="flex flex-col gap-1">
            <Label htmlFor="forwarding" className="text-xs sm:text-sm font-medium">
              Data Forwarding
            </Label>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Enable forwarding to reduce stalls
            </p>
          </div>
          <Switch
            id="forwarding"
            checked={withForwarding}
            onCheckedChange={setWithForwarding}
          />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            onClick={handleSimulate}
            className="flex-1 gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm"
            size="default"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Simulate Pipeline</span>
            <span className="sm:hidden">Simulate</span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="default"
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
