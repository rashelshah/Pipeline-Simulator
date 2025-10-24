export type Stage = "IF" | "ID" | "EX" | "MEM" | "WB" | "STALL" | "-";

export interface Instruction {
  name: string;
  operation: string;
  dest?: string;
  src1?: string;
  src2?: string;
}

export interface PipelineState {
  instruction: Instruction;
  stages: Stage[];
  isForwarded?: boolean;
  hasHazard?: boolean;
}

export interface SimulationResult {
  cycles: number;
  states: PipelineState[];
  withForwarding: boolean;
}

const STAGE_ORDER: Stage[] = ["IF", "ID", "EX", "MEM", "WB"];

export function parseInstruction(line: string): Instruction | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  // Match patterns like: ADD R1, R2, R3 or LW R1, 0(R2)
  const match = trimmed.match(/^(\w+)\s+([^,]+)(?:,\s*([^,]+))?(?:,\s*(.+))?$/);
  if (!match) return null;

  const [, operation, dest, src1, src2] = match;
  return {
    name: trimmed,
    operation: operation.toUpperCase(),
    dest: dest?.trim().replace(/[()]/g, ""),
    src1: src1?.trim().replace(/[()]/g, ""),
    src2: src2?.trim().replace(/[()]/g, ""),
  };
}

function detectDataHazard(
  current: Instruction,
  previous: PipelineState[],
  currentCycle: number
): { hasHazard: boolean; stallCycles: number } {
  if (!current.src1 && !current.src2) return { hasHazard: false, stallCycles: 0 };

  for (let i = previous.length - 1; i >= 0; i--) {
    const prev = previous[i];
    const prevInstr = prev.instruction;

    if (!prevInstr.dest) continue;

    // Check if current instruction depends on previous instruction's destination
    const dependsOn =
      current.src1 === prevInstr.dest || current.src2 === prevInstr.dest;

    if (dependsOn) {
      // Find which stage the previous instruction is in at the current cycle
      const prevStageIndex = prev.stages.findIndex(
        (stage, idx) => idx === currentCycle && stage !== "-"
      );

      if (prevStageIndex !== -1) {
        const prevStage = prev.stages[currentCycle];
        // If previous instruction hasn't reached MEM stage, we have a hazard
        if (prevStage !== "MEM" && prevStage !== "WB" && prevStage !== "-") {
          return { hasHazard: true, stallCycles: 1 };
        }
      }
    }
  }

  return { hasHazard: false, stallCycles: 0 };
}

export function simulatePipeline(
  instructions: Instruction[],
  withForwarding: boolean
): SimulationResult {
  const states: PipelineState[] = [];
  let maxCycles = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    const stages: Stage[] = [];
    let currentCycle = i; // Each instruction starts one cycle after the previous
    let isForwarded = false;
    let hasHazard = false;

    // Check for data hazard
    if (!withForwarding && i > 0) {
      const hazardCheck = detectDataHazard(instr, states, currentCycle);
      if (hazardCheck.hasHazard) {
        hasHazard = true;
        currentCycle += hazardCheck.stallCycles;
      }
    } else if (withForwarding && i > 0) {
      // With forwarding, we still detect hazards but mark as forwarded
      const hazardCheck = detectDataHazard(instr, states, currentCycle);
      if (hazardCheck.hasHazard) {
        isForwarded = true;
      }
    }

    // Fill cycles before instruction starts
    for (let c = 0; c < currentCycle; c++) {
      stages.push("-");
    }

    // Add stall if needed
    if (hasHazard && !withForwarding) {
      stages.push("STALL");
    }

    // Execute through pipeline stages
    for (const stage of STAGE_ORDER) {
      stages.push(stage);
    }

    // Calculate max cycles
    maxCycles = Math.max(maxCycles, stages.length);

    states.push({
      instruction: instr,
      stages,
      isForwarded,
      hasHazard,
    });
  }

  // Pad all instructions to have the same number of cycles
  states.forEach((state) => {
    while (state.stages.length < maxCycles) {
      state.stages.push("-");
    }
  });

  return {
    cycles: maxCycles,
    states,
    withForwarding,
  };
}

export function getStageColor(stage: Stage): string {
  const colorMap: Record<Stage, string> = {
    IF: "bg-stage-if",
    ID: "bg-stage-id",
    EX: "bg-stage-ex",
    MEM: "bg-stage-mem",
    WB: "bg-stage-wb",
    STALL: "bg-stage-stall",
    "-": "bg-transparent",
  };
  return colorMap[stage];
}

export function getStageLabel(stage: Stage): string {
  if (stage === "-") return "";
  return stage;
}
