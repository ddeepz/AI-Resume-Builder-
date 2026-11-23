import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GenerateResumeBody {
  prompt: string;
}

interface GeneratedResume {
  summary: string;
  objective: string;
  education: { college: string; degree: string; department: string; year: string; cgpa: string }[];
  skills: { technical: string[]; programming: string[]; soft: string[] };
  projects: { title: string; description: string; technologies: string }[];
  experience: { company: string; position: string; duration: string; responsibilities: string }[];
  certificates: { name: string; organization: string; year: string }[];
  achievements: { title: string; description: string }[];
  languages: string;
  missingInfo: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateResumeBody;
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "You are an expert resume writer and career coach. Given a natural-language description of a candidate, you produce a complete, ATS-friendly resume in JSON.\n\nRules:\n- NEVER invent personal data (name, email, phone, LinkedIn, portfolio). Leave those as empty strings; list what is missing in missingInfo.\n- Generate strong, professional content for every section using the details the user gave.\n- Use action verbs and quantify impact where the user provided numbers.\n- Distinguish fresher vs experienced profiles based on the prompt.\n- Skills must be split into technical (tools/frameworks), programming (languages), and soft skills.\n- Each experience entry responsibilities field must be 2-4 bullet lines separated by \\n starting with •.\n- Output ONLY a JSON object with this exact shape:\n{\n  \"summary\": string,\n  \"objective\": string,\n  \"education\": [{\"college\": string, \"degree\": string, \"department\": string, \"year\": string, \"cgpa\": string}],\n  \"skills\": {\"technical\": string[], \"programming\": string[], \"soft\": string[]},\n  \"projects\": [{\"title\": string, \"description\": string, \"technologies\": string}],\n  \"experience\": [{\"company\": string, \"position\": string, \"duration\": string, \"responsibilities\": string}],\n  \"certificates\": [{\"name\": string, \"organization\": string, \"year\": string}],\n  \"achievements\": [{\"title\": string, \"description\": string}],\n  \"languages\": string,\n  \"missingInfo\": string[]\n}\nNo markdown, no code fences, no commentary — just the JSON object.",
        },
        {
          role: "user",
          content: `Candidate description: """${prompt}"""\n\nGenerate the complete resume JSON now.`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    let parsed: GeneratedResume;
    try {
      const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned an unexpected format. Please try again.", raw },
        { status: 502 }
      );
    }

    const normalize = <T,>(v: T[] | undefined): T[] => (Array.isArray(v) ? v : []);
    parsed.education = normalize(parsed.education);
    parsed.skills = {
      technical: normalize(parsed.skills?.technical),
      programming: normalize(parsed.skills?.programming),
      soft: normalize(parsed.skills?.soft),
    };
    parsed.projects = normalize(parsed.projects);
    parsed.experience = normalize(parsed.experience);
    parsed.certificates = normalize(parsed.certificates);
    parsed.achievements = normalize(parsed.achievements);
    parsed.missingInfo = normalize(parsed.missingInfo);

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
