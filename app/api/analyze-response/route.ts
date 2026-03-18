import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, remaining } = checkRateLimit(ip, "analyze", 20);
    if (!allowed) {
      return NextResponse.json(
        { error: "You've hit the limit — try again in an hour. (20 analyses/hour)" },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    const { dealType, formData, currentEmail, dealerResponse } = await request.json();

    if (!dealerResponse?.trim()) {
      return NextResponse.json(
        { error: "Paste the dealer's response so I can analyze it." },
        { status: 400 }
      );
    }

    // Build context about the user's deal
    let dealContext = `Deal type: ${dealType?.toUpperCase() || "Unknown"}\n`;
    if (formData?.vehicle) dealContext += `Vehicle: ${formData.vehicle}\n`;
    if (formData?.term) dealContext += `Term: ${formData.term}\n`;
    if (formData?.milesPerYear) dealContext += `Miles/year: ${formData.milesPerYear}\n`;
    if (formData?.downPayment) dealContext += `Down payment: ${formData.downPayment}\n`;
    if (formData?.zipCode) dealContext += `Zip code: ${formData.zipCode}\n`;
    if (formData?.name) dealContext += `Buyer name: ${formData.name}\n`;

    let emailContext = "";
    if (currentEmail) {
      emailContext = `\n\nThe email the buyer sent to the dealer:\nSubject: ${currentEmail.subject}\n\n${currentEmail.body}`;
    }

    const userMessage = `I sent a negotiation email to a dealer and got a response. Help me understand what they're really saying and what I should do next.

MY DEAL DETAILS:
${dealContext}${emailContext}

DEALER'S RESPONSE:
${dealerResponse}

Analyze this dealer response. Break it down for me:
1. What are they actually saying? (Read between the lines using your insider knowledge)
2. Is this a good response, a vague response, or a red flag?
3. What should I do next — counter, accept, ask for clarification, or walk away?
4. If I should counter, what specifically should I push on?

Be direct and specific. No generic advice — tell me what to do based on THIS response.`;

    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}

ADDITIONAL CONTEXT: The user has sent a negotiation email to a dealer and received a response. They want you to analyze the dealer's response using your insider knowledge. Be direct, specific, and actionable. Tell them exactly what the dealer is doing and what their next move should be.

At the end of your analysis, include a single line starting with "RECOMMENDATION:" followed by one of: COUNTER, ACCEPT, CLARIFY, or WALK_AWAY. This line will be parsed programmatically — do not include anything else on that line.`,
      messages: [{ role: "user", content: userMessage }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse recommendation from the response
    const recMatch = responseText.match(/^RECOMMENDATION:\s*(COUNTER|ACCEPT|CLARIFY|WALK_AWAY)\s*$/m);
    const recommendation = recMatch ? recMatch[1].toLowerCase().replace("_", "_") : "counter";

    // Remove the RECOMMENDATION line from the analysis text
    const analysis = responseText.replace(/^RECOMMENDATION:.*$/m, "").trim();

    return NextResponse.json({
      analysis,
      recommendation,
    });
  } catch (err) {
    console.error("Error analyzing response:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to analyze dealer response";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
