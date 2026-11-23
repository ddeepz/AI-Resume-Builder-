import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImproveAction =
  | "improve"
  | "professional"
  | "grammar"
  | "shorten"
  | "expand"
  | "ats";

interface ImproveBody {
  action: ImproveAction;
  text: string;
  role?: string;
}

const ACTION_PROMPTS: Record<ImproveAction, string> = {
  improve:
    "Improve the writing quality of the following resume text. Keep the meaning, make it clearer and more impactful. Preserve bullet markers (•) if present. Output ONLY the improved text.",
  professional:
    "Rewrite the following resume text to sound more professional and polished. Use strong action verbs and business-appropriate tone. Preserve bullet markers (•) if present. Output ONLY the rewritten text.",
  grammar:
    "Fix any grammar, spelling, or punctuation errors in the following resume text. Do not change the meaning. Preserve bullet markers (•) if present. Output ONLY the corrected text.",
  shorten:
    "Shorten the following resume text by roughly 30-40% while keeping the key facts and impact. Preserve bullet markers (•) if present. Output ONLY the shortened text.",
  expand:
    "Expand the following resume text with more detail and impact. Add quantified achievements where reasonable but do not invent specific false numbers. Preserve bullet markers (•) if present. Output ONLY the expanded text.",
  ats:
    "Rewrite the following resume text to be more ATS-friendly: use standard job titles, strong action verbs, relevant keywords, and quantify impact. Preserve bullet markers (•) if present. Output ONLY the rewritten text.",
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImproveBody;
    const action = body.action;
    const text = body.text?.trim();

    if (!action || !ACTION_PROMPTS[action]) {
      return NextResponse.json({ error: "Unknown improvement action." }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: "Text to improve is required." }, { status: 400 });
    }

    const zai = await ZAI.create();
    const roleHint = body.role ? `\nTarget role: ${body.role}.` : "";

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "You are an expert resume editor. You improve resume text according to the user's instruction. You never output anything except the improved text — no headings, no quotes, no markdown.",
        },
        { role: "user", content: `${ACTION_PROMPTS[action]}${roleHint}\n\nText:\n${text}` },
      ],
      thinking: { type: "disabled" },
    });

    const improved = completion.choices[0]?.message?.content?.trim();
    if (!improved) {
      return NextResponse.json({ error: "No improved text generated." }, { status: 502 });
    }

    return NextResponse.json({ content: improved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
