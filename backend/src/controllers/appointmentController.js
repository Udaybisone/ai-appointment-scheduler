import Joi from "joi";
import { runOCR } from "../services/ocrService.js";
import { extractEntities } from "../services/nlpService.js";
import { normalizeEntities } from "../services/normalizationService.js";

const parseSchema = Joi.object({
  text: Joi.string().allow("", null),
  mode: Joi.string().valid("text", "image").required(),
});

export const parseAppointment = async (req, res, next) => {
  try {
    const body = req.body;
    const { error, value } = parseSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { mode } = value;

    // STEP 1 - OCR / TEXT EXTRACTION
    let rawText = value.text || "";
    let ocrConfidence = 0.9;

    if (mode === "image") {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Image file is required for mode=image" });
      }
      const { text, confidence } = await runOCR(req.file);
      rawText = text;
      ocrConfidence = confidence;
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: "No text to parse" });
    }

    const step1Output = {
      raw_text: rawText,
      confidence: ocrConfidence,
    };

    // STEP 2 - ENTITY EXTRACTION
    const {
      entities,
      entities_confidence,
      needs_clarification: entitiesAmbiguous,
      reason: entitiesReason,
    } = await extractEntities(rawText);

    if (entitiesAmbiguous) {
      return res.status(200).json({
        step1: step1Output,
        step2: {
          entities,
          entities_confidence,
        },
        status: "needs_clarification",
        message: entitiesReason || "Ambiguous date/time or department",
      });
    }

    const step2Output = {
      entities,
      entities_confidence,
    };

    // STEP 3 - NORMALIZATION
    const {
      normalized,
      normalization_confidence,
      needs_clarification: normAmbiguous,
      reason: normReason,
    } = await normalizeEntities(entities);

    if (normAmbiguous) {
      return res.status(200).json({
        step1: step1Output,
        step2: step2Output,
        status: "needs_clarification",
        message: normReason || "Ambiguous date/time or department",
      });
    }

    const step3Output = {
      normalized,
      normalization_confidence,
    };

    // STEP 4 - FINAL APPOINTMENT JSON
    const appointmentData = {
      department: normalized.department_canonical || entities.department,
      date: normalized.date,
      time: normalized.time,
      tz: normalized.tz,
    };

    const finalOutput = {
      appointment: appointmentData,
      status: "ok",
    };

    return res.status(200).json({
      step1: step1Output,
      step2: step2Output,
      step3: step3Output,
      final: finalOutput,
    });
  } catch (err) {
    next(err);
  }
};
