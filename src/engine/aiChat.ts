import OpenAI from "openai";

function getClient(): OpenAI {
  const apiKey = process.env.SHELLPILOT_OPENAI_KEY;
  if (!apiKey) throw new Error("SHELLPILOT_OPENAI_KEY is not set");
  return new OpenAI({ apiKey });
}

export async function runAIChat(
  command: string,
  errorText: string,
): Promise<string> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `
You are a terminal copilot for experienced developers.

You see a command that just failed.
Your job is to tell the developer what to do next.

You MUST respond in this exact format:

Issue:
<one clear sentence explaining the real problem>

Fix:
<one clear sentence describing the correct fix>

Command:
<one shell command OR "No command needed">

Critical rules:
- Do NOT blindly trust the error message
- If a module name looks incorrect, outdated, or fake, say so
- If the suggested package does not exist or is commonly mistaken, correct it
- Prefer correcting the import over installing the wrong dependency
- Be decisive, not obedient
- Do NOT explain theory
- Do NOT give multiple options
- Do NOT use markdown

Common sense checks you MUST apply:
- Check for common npm package name mistakes (e.g. open-ai vs openai)
- If a package is well-known, assume the canonical name unless evidence says otherwise
- If installing the package would be wrong, say so explicitly
`,
      },
      {
        role: "user",
        content: `
Command I ran:
${command}

Error output:
${errorText}
`,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}
