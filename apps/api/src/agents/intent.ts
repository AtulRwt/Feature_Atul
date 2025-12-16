export type AgentIntent =
  | "SALES"
  | "DOCUMENTATION"
  | "UNDERWRITING"
  | "UNKNOWN";

export function detectIntent(message: string): AgentIntent {
  const msg = message.toLowerCase();

  if (
    msg.includes("emi") ||
    msg.includes("interest") ||
    msg.includes("loan") ||
    msg.includes("amount")
  ) {
    return "SALES";
  }

  if (
    msg.includes("pan") ||
    msg.includes("aadhaar") ||
    msg.includes("document") ||
    msg.includes("upload")
  ) {
    return "DOCUMENTATION";
  }

  if (
    msg.includes("approve") ||
    msg.includes("underwriting") ||
    msg.includes("sanction")
  ) {
    return "UNDERWRITING";
  }

  return "UNKNOWN";
}
