import { DateTime } from "luxon";
import { textModel } from "./geminiClient.js";

const TIMEZONE = "Asia/Kolkata";

/**
 * normalizeEntities
 * Input: entities from extractEntities
 * Output:
 * {
 *   normalized: { date, time, tz, department_canonical },
 *   normalization_confidence,
 *   needs_clarification,
 *   reason
 * }
 */
export const normalizeEntities = async (entities) => {
  const { date_phrase, time_phrase, department } = entities || {};

  // Guardrail: missing anything => needs clarification
  if (!date_phrase || !time_phrase || !department) {
    return {
      normalized: null,
      normalization_confidence: 0,
      needs_clarification: true,
      reason: "Ambiguous date/time or department",
    };
  }

  const now = DateTime.now().setZone(TIMEZONE).toISO();

  const systemPrompt = `
You normalize appointment entities.

You MUST return ONLY JSON and NOTHING else.

JSON shape (exact keys):

{
  "normalized": {
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "tz": "Asia/Kolkata",
    "department_canonical": "Capitalized department name like Dentistry, Cardiology etc."
  },
  "normalization_confidence": 0.0-1.0,
  "needs_clarification": true/false,
  "reason": "string explanation"
}

Rules:
- Interpret the date phrase relative to "now".
- Use 24-hour time in "HH:mm".
- tz MUST be exactly "Asia/Kolkata".
- If anything is ambiguous (date or time not clear, or department unclear),
  set needs_clarification=true and explain in "reason".
`;

  const userPrompt = `
Now: ${now}
Date phrase: "${date_phrase}"
Time phrase: "${time_phrase}"
Department phrase: "${department}"
`;

  try {
    const result = await textModel.generateContent([systemPrompt, userPrompt]);

    const response = await result.response;
    const rawText = response.text().trim();

    // Sometimes the model may add extra text. Safely extract JSON.
    let jsonText = rawText;
    const firstBrace = rawText.indexOf("{");
    const lastBrace = rawText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = rawText.slice(firstBrace, lastBrace + 1);
    }

    let parsed = JSON.parse(jsonText);

    // Safety: ensure tz is set correctly
    if (parsed.normalized) {
      parsed.normalized.tz = TIMEZONE;
    } else {
      // If normalized missing, treat as clarification needed
      parsed = {
        normalized: null,
        normalization_confidence: 0,
        needs_clarification: true,
        reason: "Ambiguous date/time or department",
      };
    }

    return parsed;
  } catch (err) {
    console.error("Normalization error:", err);
    return {
      normalized: null,
      normalization_confidence: 0,
      needs_clarification: true,
      // Generic message to match your guardrail spec
      reason: "Ambiguous date/time or department",
    };
  }
};
