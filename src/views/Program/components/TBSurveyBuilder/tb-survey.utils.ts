import type { Node, Edge } from "@vue-flow/core";
import type { Message } from "@/models/message";
import type { Playlist } from "@/models/playlist";

export type HardwareButton =
  | "Tree"
  | "Table"
  | "Bowl"
  | "Right Hand"
  | "Left Hand"
  | "Star";

export const HARDWARE_BUTTONS: { name: HardwareButton; label: string; iconColor: string }[] = [
  { name: "Tree", label: "Tree", iconColor: "#16a34a" },
  { name: "Table", label: "Table", iconColor: "#d97706" },
  { name: "Bowl", label: "Bowl", iconColor: "#2563eb" },
  { name: "Right Hand", label: "Right Hand", iconColor: "#8b5cf6" },
  { name: "Left Hand", label: "Left Hand", iconColor: "#ec4899" },
  { name: "Star", label: "Star (Record)", iconColor: "#ca8a04" },
];

export function getButtonHandleId(button: HardwareButton): string {
  return `btn-${button.toLowerCase().replace(/\s+/g, "-")}`;
}

export function getButtonFromHandleId(handleId?: string | null): HardwareButton | undefined {
  if (!handleId || !handleId.startsWith("btn-")) return undefined;
  const slug = handleId.replace("btn-", "");
  return HARDWARE_BUTTONS.find(
    (b) => b.name.toLowerCase().replace(/\s+/g, "-") === slug
  )?.name;
}

export interface ButtonActionConfig {
  button: HardwareButton;
  responseValue?: string;
  isRecord?: boolean;
  targetQuestionId?: string; // e.g. "q11" or "epilog"
}

export interface SurveyQuestionData {
  id: string; // "q1", "q2"
  messageId: string;
  prompt: string;
  position: number;
  actions: Record<HardwareButton, ButtonActionConfig | undefined>;
}

export interface TBSurveyHeader {
  name: string;
  prolog: string;
  epilog: string;
  confirmExit: string;
}

export interface TBSurveyModel {
  header: TBSurveyHeader;
  questions: SurveyQuestionData[];
}

/**
 * Creates default hardware button actions for a question node.
 */
export function createDefaultActions(): Record<HardwareButton, ButtonActionConfig | undefined> {
  return {
    Tree: { button: "Tree", responseValue: "Yes" },
    Table: { button: "Table", responseValue: "No" },
    Bowl: { button: "Bowl", responseValue: "No response" },
    "Right Hand": undefined,
    "Left Hand": undefined,
    Star: undefined,
  };
}

export interface ParsedSurveyYaml {
  header: TBSurveyHeader;
  questions: Record<string, {
    prompt?: string;
    actions: Record<HardwareButton, ButtonActionConfig | undefined>;
  }>;
}

/**
 * Parses Talking Book survey YAML string into structured header and button actions.
 */
export function parseSurveyYaml(yamlStr: string): ParsedSurveyYaml {
  const header: TBSurveyHeader = {
    name: "Survey",
    prolog: "Welcome to the talking book satisfaction survey",
    epilog: "Thank you for your participation",
    confirmExit: "s1confirm",
  };
  const questions: Record<string, {
    prompt?: string;
    actions: Record<HardwareButton, ButtonActionConfig | undefined>;
  }> = {};

  if (!yamlStr || typeof yamlStr !== "string") {
    return { header, questions };
  }

  const lines = yamlStr.split(/\r?\n/);
  let currentSection: "header" | "question" | null = null;
  let currentQId = "";
  let currentButton: HardwareButton | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    if (line === "Survey:") {
      currentSection = "header";
      currentQId = "";
      currentButton = null;
      continue;
    }

    const qMatch = line.match(/^(q\d+):$/);
    if (qMatch) {
      currentSection = "question";
      currentQId = qMatch[1];
      currentButton = null;
      if (!questions[currentQId]) {
        questions[currentQId] = {
          actions: {
            Tree: undefined,
            Table: undefined,
            Bowl: undefined,
            "Right Hand": undefined,
            "Left Hand": undefined,
            Star: undefined,
          },
        };
      }
      continue;
    }

    if (currentSection === "header") {
      const nameMatch = line.match(/^Name:\s*(.*)$/);
      if (nameMatch) header.name = nameMatch[1].trim();

      const prologMatch = line.match(/^Prolog:\s*(.*)$/);
      if (prologMatch) header.prolog = prologMatch[1].trim();

      const epilogMatch = line.match(/^Epilog:\s*(.*)$/);
      if (epilogMatch) header.epilog = epilogMatch[1].trim();

      const exitMatch = line.match(/^ConfirmExit:\s*(.*)$/);
      if (exitMatch) header.confirmExit = exitMatch[1].trim();
      continue;
    }

    if (currentSection === "question" && currentQId) {
      const qObj = questions[currentQId];

      const promptMatch = line.match(/^Prompt:\s*(.*)$/);
      if (promptMatch) {
        qObj.prompt = promptMatch[1].trim();
        currentButton = null;
        continue;
      }

      let matchedBtn: HardwareButton | null = null;
      let btnRest = "";

      for (const hBtn of HARDWARE_BUTTONS) {
        const prefix = `${hBtn.name}:`;
        if (line.startsWith(prefix)) {
          matchedBtn = hBtn.name;
          btnRest = line.substring(prefix.length).trim();
          break;
        }
      }

      if (matchedBtn) {
        currentButton = matchedBtn;
        if (!qObj.actions[matchedBtn]) {
          qObj.actions[matchedBtn] = { button: matchedBtn };
        }
        const act = qObj.actions[matchedBtn]!;

        if (btnRest) {
          if (btnRest === "record") {
            act.isRecord = true;
          } else if (btnRest.startsWith("go(") && btnRest.endsWith(")")) {
            const target = btnRest.substring(3, btnRest.length - 1).trim();
            act.targetQuestionId = target === "exit" ? "epilog" : target;
          } else {
            act.responseValue = btnRest.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
          }
        }
        continue;
      }

      if (currentButton && line.startsWith("- ")) {
        const itemVal = line.substring(2).trim();
        const act = qObj.actions[currentButton]!;

        if (itemVal === "record") {
          act.isRecord = true;
        } else if (itemVal.startsWith("go(") && itemVal.endsWith(")")) {
          const target = itemVal.substring(3, itemVal.length - 1).trim();
          act.targetQuestionId = target === "exit" ? "epilog" : target;
        } else {
          act.responseValue = itemVal.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        }
        continue;
      }
    }
  }

  return { header, questions };
}

/**
 * Generates initial nodes & edges from a Playlist and its Messages.
 * playlist.messages is the single source of truth for audio messages and metadata.
 * playlist.survey_yaml overlays saved survey actions/branches if present.
 */
export function playlistToGraph(playlist: Playlist): {
  nodes: Node[];
  edges: Edge[];
  header: TBSurveyHeader;
} {
  const parsed = playlist.survey_yaml ? parseSurveyYaml(playlist.survey_yaml) : null;

  const header: TBSurveyHeader = parsed
    ? parsed.header
    : {
        name: (playlist.title || "Survey").replace(/[^a-zA-Z0-9_]/g, ""),
        prolog: "Welcome to the talking book satisfaction survey",
        epilog: "Thank you for your participation",
        confirmExit: "s1confirm",
      };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Prolog node (undeletable)
  nodes.push({
    id: "prolog",
    type: "prolog",
    position: { x: 300, y: 50 },
    data: {
      title: "Prolog (Welcome)",
      text: header.prolog,
    },
    deletable: false,
  });

  const messages = playlist.messages || [];

  // 2. Question nodes - playlist.messages is the single source of truth!
  messages.forEach((msg: Message, index: number) => {
    const qId = `q${index + 1}`;
    const isLast = index === messages.length - 1;

    let actions: Record<HardwareButton, ButtonActionConfig | undefined>;
    if (parsed && parsed.questions[qId]) {
      actions = parsed.questions[qId].actions;
    } else {
      actions = createDefaultActions();
    }

    const qData: SurveyQuestionData = {
      id: qId,
      messageId: msg._id,
      prompt: msg.title || `Question ${index + 1}`,
      position: index + 1,
      actions,
    };

    nodes.push({
      id: qId,
      type: "question",
      position: { x: 300, y: 220 + index * 260 },
      data: qData,
      deletable: true,
    });

    // Default sequential connection from Prolog to q1
    if (index === 0) {
      edges.push({
        id: "edge-prolog-q1",
        source: "prolog",
        sourceHandle: "prolog-out",
        target: qId,
        targetHandle: "target",
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2 },
      });
    }

    // Add branch edges from actions
    HARDWARE_BUTTONS.forEach(({ name: btnName }) => {
      const act = actions[btnName];
      if (act && act.targetQuestionId && act.targetQuestionId !== "next") {
        const targetLabel = act.targetQuestionId === "epilog" ? "exit" : act.targetQuestionId;
        const handleId = getButtonHandleId(btnName);
        edges.push({
          id: `edge-${qId}-${handleId}-${act.targetQuestionId}`,
          source: qId,
          sourceHandle: handleId,
          target: act.targetQuestionId,
          targetHandle: act.targetQuestionId === "epilog" ? "epilog-in" : "target",
          label: `${btnName} -> go(${targetLabel})`,
          animated: true,
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
        });
      }
    });

    // Connect last question to epilog by default if not already branching to epilog
    if (isLast && !edges.some((e) => e.source === qId && e.target === "epilog")) {
      edges.push({
        id: `edge-${qId}-epilog`,
        source: qId,
        sourceHandle: getButtonHandleId("Tree"),
        target: "epilog",
        targetHandle: "epilog-in",
        label: "Finish",
        style: { stroke: "#6366f1", strokeWidth: 2 },
      });
    }
  });

  // 3. Epilog node (undeletable)
  const epilogY = messages.length > 0 ? 220 + messages.length * 260 : 300;
  nodes.push({
    id: "epilog",
    type: "epilog",
    position: { x: 300, y: epilogY },
    data: {
      title: "Epilog (Thank You)",
      text: header.epilog,
    },
    deletable: false,
  });

  return { nodes, edges, header };
}

/**
 * Calculates a clean hierarchical layout for the graph nodes.
 */
export function calculateHierarchicalLayout<T extends Node>(nodes: T[], edges: Edge[]): T[] {
  const nodeMap = new Map<string, T>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Build question ordering
  const questionNodes = nodes.filter((n) => n.id.startsWith("q"));
  questionNodes.sort((a, b) => {
    const aNum = parseInt(a.id.replace("q", ""), 10) || 0;
    const bNum = parseInt(b.id.replace("q", ""), 10) || 0;
    return aNum - bNum;
  });

  // Calculate coordinates
  let currentY = 50;
  const prologNode = nodeMap.get("prolog");
  if (prologNode) {
    prologNode.position = { x: 320, y: currentY };
    currentY += 180;
  }

  // Position questions in an organized sequence with branch offsets
  questionNodes.forEach((qn, index) => {
    // Check if this question is targeted by a branch jump
    const incomingBranches = edges.filter(
      (e) => e.target === qn.id && e.source !== "prolog" && e.source !== `q${index}`
    );

    const xPos = incomingBranches.length > 0 ? 460 : 320;
    qn.position = { x: xPos, y: currentY };
    currentY += 280;
  });

  const epilogNode = nodeMap.get("epilog");
  if (epilogNode) {
    epilogNode.position = { x: 320, y: currentY + 40 };
  }

  return nodes;
}

/**
 * Serializes the Survey Model into Talking Book device YAML format.
 */
export function surveyToYaml(header: TBSurveyHeader, questions: SurveyQuestionData[]): string {
  const lines: string[] = [];

  // Survey Header
  lines.push("Survey:");
  lines.push(`  Name: ${header.name || "Survey"}`);
  lines.push(`  Prolog: ${header.prolog || ""}`);
  lines.push(`  Epilog: ${header.epilog || ""}`);
  lines.push(`  ConfirmExit: ${header.confirmExit || "s1confirm"}`);
  lines.push("");

  // Questions
  questions.forEach((q) => {
    lines.push(`${q.id}:`);
    lines.push(`  Prompt: ${q.prompt || ""}`);

    HARDWARE_BUTTONS.forEach(({ name: btnName }) => {
      const act = q.actions[btnName];
      if (!act) return;

      const hasValue = !!act.responseValue;
      const isRecord = !!act.isRecord;
      const hasJump = !!act.targetQuestionId && act.targetQuestionId !== "next";
      const jumpTarget = act.targetQuestionId === "epilog" ? "exit" : act.targetQuestionId;

      if (isRecord && hasJump) {
        lines.push(`  ${btnName}:`);
        lines.push(`    - record`);
        lines.push(`    - go(${jumpTarget})`);
      } else if (isRecord) {
        lines.push(`  ${btnName}: record`);
      } else if (hasValue && hasJump) {
        lines.push(`  ${btnName}:`);
        lines.push(`    - "${act.responseValue}"`);
        lines.push(`    - go(${jumpTarget})`);
      } else if (hasValue) {
        lines.push(`  ${btnName}: "${act.responseValue}"`);
      } else if (hasJump) {
        lines.push(`  ${btnName}: go(${jumpTarget})`);
      }
    });

    lines.push("");
  });

  return lines.join("\n");
}
