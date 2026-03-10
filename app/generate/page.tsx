"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import { getCannedAnswer } from "@/lib/canned-answers";

// ── Field definitions per deal type + stage ──

interface FieldDef {
  name: string;
  question: string;
  type: "text" | "select";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

function getFields(dealType: string, stage: string): FieldDef[] {
  if (["lease", "finance", "cash"].includes(dealType) && stage === "close") {
    return [
      { name: "name", question: "What's your full name?", type: "text", required: true, placeholder: "First Last" },
      { name: "email", question: "What's your email address?", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", question: "What's your phone number? (Required for closing)", type: "text", required: true, placeholder: "(555) 123-4567" },
      { name: "deliveryPreference", question: "How do you want to take delivery?", type: "select", required: true, options: ["Pick up at dealership", "Home delivery"] },
      { name: "deliveryTiming", question: "When do you want to take delivery?", type: "select", required: true, options: ["Today", "Tomorrow", "This week"] },
    ];
  }

  if (dealType === "lease") {
    const base: FieldDef[] = [
      { name: "vehicle", question: "What vehicle are you looking at? (Stock #, VIN, or Year Make Model Trim)", type: "text", required: true, placeholder: "e.g. 2026 BMW X5 xDrive40i" },
      { name: "term", question: "What lease term do you want?", type: "select", required: true, options: ["24 months", "27 months", "30 months", "33 months", "36 months", "39 months", "42 months", "48 months"] },
      { name: "milesPerYear", question: "How many miles per year?", type: "select", required: true, options: ["7,500", "10,000", "12,000", "15,000"] },
      { name: "downPayment", question: "How much are you putting down / drive-off?", type: "text", required: true, placeholder: "$0, $1,000, $2,000, etc." },
      { name: "zipCode", question: "What's your zip code?", type: "text", required: true, placeholder: "90210" },
      { name: "name", question: "What's your full name?", type: "text", required: true, placeholder: "First Last" },
      { name: "email", question: "What's your email address?", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", question: "Phone number? (Optional — press Enter to skip)", type: "text", required: false, placeholder: "Optional" },
      { name: "timePreference", question: "How soon are you ready to move?", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerQuote", question: "What did the dealer quote you? (e.g. $650/mo)", type: "text", required: true, placeholder: "$650/mo" },
        { name: "desiredPayment", question: "What payment works for you? (Include tax if possible)", type: "text", required: true, placeholder: "$550/mo including tax" },
      );
    }
    return base;
  }

  if (dealType === "finance") {
    const base: FieldDef[] = [
      { name: "vehicle", question: "What vehicle are you looking at? (Stock #, VIN, or Year Make Model Trim)", type: "text", required: true, placeholder: "e.g. 2026 Toyota 4Runner TRD Pro" },
      { name: "term", question: "What loan term do you want?", type: "select", required: true, options: ["36 months", "48 months", "60 months", "72 months", "84 months"] },
      { name: "downPayment", question: "How much are you putting down?", type: "text", required: true, placeholder: "$0, $2,000, $5,000, etc." },
      { name: "zipCode", question: "What's your zip code?", type: "text", required: true, placeholder: "90210" },
      { name: "name", question: "What's your full name?", type: "text", required: true, placeholder: "First Last" },
      { name: "email", question: "What's your email address?", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", question: "Phone number? (Optional — press Enter to skip)", type: "text", required: false, placeholder: "Optional" },
      { name: "timePreference", question: "How soon are you ready to move?", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerQuote", question: "Paste or summarize what the dealer quoted you.", type: "text", required: true, placeholder: "e.g. $45,000 selling price, $780/mo at 6.9% APR" },
        { name: "negotiationMetric", question: "What do you want to negotiate on?", type: "select", required: true, options: ["Selling Price", "Monthly Payment", "OTD Price", "APR"] },
        { name: "desiredNumber", question: "What's your target number for that?", type: "text", required: true, placeholder: "Enter your target" },
      );
    }
    return base;
  }

  if (dealType === "cash") {
    const base: FieldDef[] = [
      { name: "vehicle", question: "What vehicle are you looking at? (Stock #, VIN, or Year Make Model Trim)", type: "text", required: true, placeholder: "e.g. 2026 Lexus RX 350" },
      { name: "zipCode", question: "What's your zip code?", type: "text", required: true, placeholder: "90210" },
      { name: "name", question: "What's your full name?", type: "text", required: true, placeholder: "First Last" },
      { name: "email", question: "What's your email address?", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", question: "Phone number? (Optional — press Enter to skip)", type: "text", required: false, placeholder: "Optional" },
      { name: "timePreference", question: "How soon are you ready to move?", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerOTD", question: "What OTD price did the dealer quote you?", type: "text", required: true, placeholder: "$42,500" },
        { name: "desiredSellingPrice", question: "What's your target selling price? (Press Enter to skip)", type: "text", required: false, placeholder: "Optional" },
        { name: "desiredOTD", question: "What's your target OTD price? (Press Enter to skip)", type: "text", required: false, placeholder: "Optional" },
      );
    }
    return base;
  }

  if (dealType === "inventory") {
    return [
      { name: "vehicle", question: "What vehicle are you looking for? (Year Make Model)", type: "text", required: true, placeholder: "e.g. 2026 Toyota Camry" },
      { name: "purchaseType", question: "How are you planning to pay?", type: "select", required: true, options: ["Lease", "Finance", "Cash"] },
      { name: "name", question: "What's your full name?", type: "text", required: true, placeholder: "First Last" },
      { name: "email", question: "What's your email address?", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", question: "What's your phone number? (Required for inventory inquiries)", type: "text", required: true, placeholder: "(555) 123-4567" },
      { name: "timePreference", question: "How soon are you ready to move?", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
  }

  return [];
}

// ── Chat message types ──

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  type: "text" | "options" | "email" | "loading" | "error";
  content?: string;
  options?: { label: string; value: string }[];
  emailResult?: { subject: string; body: string; tips: string[] };
}

const dealTypeOptions = [
  { label: "Lease", value: "lease" },
  { label: "Finance", value: "finance" },
  { label: "Cash Purchase", value: "cash" },
  { label: "Inventory", value: "inventory" },
];

const stageOptions: Record<string, { label: string; value: string }[]> = {
  lease: [
    { label: "Quote Request", value: "quote" },
    { label: "Counter Offer", value: "counter" },
    { label: "Close", value: "close" },
  ],
  finance: [
    { label: "Quote Request", value: "quote" },
    { label: "Counter Offer", value: "counter" },
    { label: "Close", value: "close" },
  ],
  cash: [
    { label: "Quote Request", value: "quote" },
    { label: "Counter Offer", value: "counter" },
    { label: "Close", value: "close" },
  ],
  inventory: [
    { label: "Inquiry", value: "inquiry" },
    { label: "Factory Order", value: "order" },
  ],
};

export default function GeneratePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      content: "Hey — I'm CarSalesGuy. Tell me what you're buying and I'll write an email that makes dealers fight for your business.",
    },
    {
      id: "deal-type-ask",
      role: "assistant",
      type: "options",
      content: "What type of deal are you working on?",
      options: dealTypeOptions,
    },
  ]);

  const [dealType, setDealType] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);

  // ── Refinement mode state ──
  const [refineMode, setRefineMode] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<{ subject: string; body: string } | null>(null);
  const [refineHistory, setRefineHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (awaitingInput || refineMode) {
      inputRef.current?.focus();
    }
  }, [awaitingInput, refineMode]);

  const addMessages = (...msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  };

  // ── Handle option selection (deal type, stage, select fields) ──
  const handleOptionSelect = (value: string, label: string) => {
    addMessages({ id: `user-${Date.now()}`, role: "user", type: "text", content: label });

    if (!dealType) {
      const newDealType = value;
      setDealType(newDealType);
      setTimeout(() => {
        addMessages({
          id: `stage-ask-${Date.now()}`,
          role: "assistant",
          type: "options",
          content: "What stage are you at in the process?",
          options: stageOptions[newDealType],
        });
      }, 300);
      return;
    }

    if (!stage) {
      const newStage = value;
      setStage(newStage);
      const newFields = getFields(dealType, newStage);
      setFields(newFields);
      setCurrentFieldIndex(0);
      setCollectedData({});
      setTimeout(() => {
        askQuestion(newFields, 0);
      }, 300);
      return;
    }

    handleFieldAnswer(value);
  };

  // ── Ask the current question (skips fields we already have data for) ──
  const askQuestion = (fieldList: FieldDef[], index: number, existingData?: Record<string, string>) => {
    const data = existingData || collectedData;

    let i = index;
    while (i < fieldList.length && data[fieldList[i].name]) {
      i++;
    }

    if (i !== index) {
      setCurrentFieldIndex(i);
    }

    if (i >= fieldList.length) {
      generateEmail(data);
      return;
    }

    const field = fieldList[i];

    if (field.type === "select" && field.options) {
      addMessages({
        id: `q-${field.name}-${Date.now()}`,
        role: "assistant",
        type: "options",
        content: field.question,
        options: field.options.map((o) => ({ label: o, value: o })),
      });
      setAwaitingInput(false);
    } else {
      addMessages({
        id: `q-${field.name}-${Date.now()}`,
        role: "assistant",
        type: "text",
        content: field.question,
      });
      setAwaitingInput(true);
    }
  };

  // ── Handle a field answer ──
  const handleFieldAnswer = (value: string) => {
    const field = fields[currentFieldIndex];
    if (!field) return;

    const newData = { ...collectedData, [field.name]: value };
    setCollectedData(newData);

    const nextIndex = currentFieldIndex + 1;
    setCurrentFieldIndex(nextIndex);
    setAwaitingInput(false);

    setTimeout(() => {
      askQuestion(fields, nextIndex, newData);
    }, 300);
  };

  // ── Handle text input submission ──
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputValue.trim();

    if (refineMode) {
      if (!value) return;
      addMessages({ id: `user-${Date.now()}`, role: "user", type: "text", content: value });
      setInputValue("");
      handleRefine(value);
      return;
    }

    const field = fields[currentFieldIndex];
    if (!field) return;

    if (field.required && !value) return;

    addMessages({
      id: `user-${Date.now()}`,
      role: "user",
      type: "text",
      content: value || "(skipped)",
    });

    setInputValue("");
    handleFieldAnswer(value);
  };

  // ── Generate the email ──
  const generateEmail = async (data?: Record<string, string>) => {
    const formData = data || collectedData;
    setIsLoading(true);
    setAwaitingInput(false);
    setRefineMode(false);

    addMessages({
      id: `loading-${Date.now()}`,
      role: "assistant",
      type: "loading",
    });

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealType, stage, formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate email");
      }

      const data = await response.json();
      const email = { subject: data.email.subject, body: data.email.body };

      setCurrentEmail(email);
      setRefineHistory([]);

      setMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `email-${Date.now()}`,
          role: "assistant",
          type: "email",
          emailResult: {
            subject: email.subject,
            body: email.body,
            tips: data.tips,
          },
        },
        {
          id: `refine-prompt-${Date.now()}`,
          role: "assistant",
          type: "text",
          content: "Want to adjust anything? Tell me to change the tone, add details, make it shorter — or ask me anything about your deal. When you're happy with the email, hit one of the options below.",
        },
        {
          id: `next-options-${Date.now()}`,
          role: "assistant",
          type: "options",
          content: undefined,
          options: [
            { label: "I'm good — what's next?", value: "__done__" },
            { label: "Start a new deal", value: "__new_deal__" },
          ],
        },
      ]);

      setRefineMode(true);
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          type: "error",
          content: err instanceof Error ? err.message : "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle refinement request ──
  const handleRefine = async (userRequest: string) => {
    if (!currentEmail) return;

    const cannedAnswer = getCannedAnswer(userRequest);
    if (cannedAnswer) {
      setRefineHistory((prev) => [
        ...prev,
        { role: "user", content: userRequest },
        { role: "assistant", content: cannedAnswer },
      ]);

      addMessages({
        id: `canned-${Date.now()}`,
        role: "assistant",
        type: "text",
        content: cannedAnswer,
      });
      return;
    }

    setIsLoading(true);

    addMessages({
      id: `loading-${Date.now()}`,
      role: "assistant",
      type: "loading",
    });

    try {
      const response = await fetch("/api/refine-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail,
          userRequest,
          conversationHistory: refineHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine email");
      }

      const data = await response.json();

      if (data.type === "email") {
        const newEmail = data.email;
        setCurrentEmail(newEmail);

        setRefineHistory((prev) => [
          ...prev,
          { role: "user", content: userRequest },
          { role: "assistant", content: `Updated the email. Subject: ${newEmail.subject}\n\n${newEmail.body}` },
        ]);

        setMessages((prev) => {
          const filtered = prev.filter((m) => m.type !== "loading");
          const newMsgs: ChatMessage[] = [];

          if (data.message) {
            newMsgs.push({
              id: `refine-text-${Date.now()}`,
              role: "assistant",
              type: "text",
              content: data.message,
            });
          }

          newMsgs.push({
            id: `email-${Date.now()}`,
            role: "assistant",
            type: "email",
            emailResult: {
              subject: newEmail.subject,
              body: newEmail.body,
              tips: [],
            },
          });

          newMsgs.push({
            id: `refine-prompt-${Date.now()}`,
            role: "assistant",
            type: "text",
            content: "Anything else you want to change, or are you ready to send?",
          });

          newMsgs.push({
            id: `next-options-${Date.now()}`,
            role: "assistant",
            type: "options",
            content: undefined,
            options: [
              { label: "I'm good — what's next?", value: "__done__" },
              { label: "Start a new deal", value: "__new_deal__" },
            ],
          });

          return [...filtered, ...newMsgs];
        });
      } else {
        setRefineHistory((prev) => [
          ...prev,
          { role: "user", content: userRequest },
          { role: "assistant", content: data.message },
        ]);

        setMessages((prev) => [
          ...prev.filter((m) => m.type !== "loading"),
          {
            id: `advice-${Date.now()}`,
            role: "assistant",
            type: "text",
            content: data.message,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          type: "error",
          content: err instanceof Error ? err.message : "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle next-step options ──
  const handleNextStep = (value: string, label: string) => {
    if (value === "__new_deal__") {
      setDealType(null);
      setStage(null);
      setFields([]);
      setCurrentFieldIndex(0);
      setCollectedData({});
      setAwaitingInput(false);
      setRefineMode(false);
      setCurrentEmail(null);
      setRefineHistory([]);
      setMessages([
        {
          id: "welcome-2",
          role: "assistant",
          type: "text",
          content: "Let's start fresh.",
        },
        {
          id: `deal-type-ask-${Date.now()}`,
          role: "assistant",
          type: "options",
          content: "What type of deal are you working on?",
          options: dealTypeOptions,
        },
      ]);
      return;
    }

    if (value === "__done__") {
      addMessages({ id: `user-done-${Date.now()}`, role: "user", type: "text", content: label });
      setRefineMode(false);

      const nextOptions: { label: string; value: string }[] = [
        { label: "Start a new deal", value: "__new_deal__" },
      ];
      if (stage !== "counter" && stage !== "close" && dealType !== "inventory") {
        nextOptions.push({ label: "Counter Offer", value: "__counter__" });
      }
      if (stage !== "close" && dealType !== "inventory") {
        nextOptions.push({ label: "Close the deal", value: "__close__" });
      }

      addMessages({
        id: `next-steps-${Date.now()}`,
        role: "assistant",
        type: "options",
        content: "Great — copy that email and send it to 3-5 dealers. What do you want to do next?",
        options: nextOptions,
      });
      return;
    }

    if (value === "__counter__" || value === "__close__") {
      const newStage = value === "__counter__" ? "counter" : "close";
      addMessages({ id: `user-next-${Date.now()}`, role: "user", type: "text", content: label });

      setStage(newStage);
      setRefineMode(false);
      setCurrentEmail(null);
      setRefineHistory([]);
      const newFields = getFields(dealType!, newStage);
      setFields(newFields);
      setCurrentFieldIndex(0);
      const carryOverData = { ...collectedData };
      setCollectedData(carryOverData);

      setTimeout(() => {
        addMessages({
          id: `carry-over-${Date.now()}`,
          role: "assistant",
          type: "text",
          content: "I've got your details from before. Just need a few more things.",
        });
        setTimeout(() => {
          askQuestion(newFields, 0, carryOverData);
        }, 300);
      }, 300);
      return;
    }
  };

  // ── Determine which handler to use for option clicks ──
  const onOptionClick = (value: string, label: string) => {
    if (value.startsWith("__")) {
      handleNextStep(value, label);
    } else {
      handleOptionSelect(value, label);
    }
  };

  // ── Input bar placeholder ──
  const getInputPlaceholder = () => {
    if (refineMode) return "Ask me to change the email, or ask about your deal...";
    return fields[currentFieldIndex]?.placeholder || "Type your answer...";
  };

  // ── Render ──
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] text-[#1a1a2e]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] py-3 px-4 sm:px-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[#1a1a2e] hover:opacity-70 transition flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="CarSalesGuy" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            CarSalesGuy AI
          </Link>
          <button
            onClick={() => {
              setDealType(null);
              setStage(null);
              setFields([]);
              setCurrentFieldIndex(0);
              setCollectedData({});
              setAwaitingInput(false);
              setRefineMode(false);
              setCurrentEmail(null);
              setRefineHistory([]);
              setMessages([
                {
                  id: "welcome-new",
                  role: "assistant",
                  type: "text",
                  content: "Let's start fresh.",
                },
                {
                  id: `deal-type-ask-${Date.now()}`,
                  role: "assistant",
                  type: "options",
                  content: "What type of deal are you working on?",
                  options: dealTypeOptions,
                },
              ]);
            }}
            className="text-sm font-medium text-[#6b7280] hover:text-[#1e3a5f] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1e3a5f]/5"
          >
            New Deal
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {messages.map((msg) => {
            if (msg.type === "loading") {
              return (
                <div key={msg.id} className="flex gap-3">
                  <Image src="/logo.jpg" alt="CarSalesGuy" width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-sm border border-[#e5e7eb]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#1e3a5f]/30 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-[#1e3a5f]/30 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-[#1e3a5f]/30 rounded-full animate-bounce [animation-delay:300ms]" />
                      <span className="text-[#9ca3af] text-sm ml-2">Writing your email...</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === "error") {
              return (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-md px-5 py-3 max-w-lg">
                    <p className="text-red-700 text-sm">{msg.content}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === "email" && msg.emailResult) {
              const { subject, body, tips } = msg.emailResult;
              const fullText = `Subject: ${subject}\n\n${body}`;
              return (
                <div key={msg.id} className="flex gap-3">
                  <Image src="/logo.jpg" alt="CarSalesGuy" width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 max-w-xl space-y-3">
                    {/* Email card */}
                    <div className="bg-white rounded-2xl rounded-tl-md overflow-hidden shadow-sm border border-[#e5e7eb]">
                      {/* Email header */}
                      <div className="px-5 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium text-[#1a1a2e]">{subject}</p>
                        </div>
                      </div>
                      {/* Email body */}
                      <div className="px-5 py-4">
                        <pre className="text-[#374151] text-sm whitespace-pre-wrap leading-relaxed font-[inherit]">{body}</pre>
                      </div>
                      {/* Copy action */}
                      <div className="px-5 py-3 border-t border-[#f0f0f0] bg-[#fafafa]">
                        <CopyButton text={fullText} />
                      </div>
                    </div>
                    {/* Tips */}
                    {tips.length > 0 && (
                      <div className="bg-[#1e3a5f]/5 rounded-2xl px-5 py-4 border border-[#1e3a5f]/10">
                        <p className="text-[#1e3a5f] text-xs font-semibold uppercase tracking-wider mb-2">Tips for this deal</p>
                        <ul className="space-y-1.5">
                          {tips.map((tip, i) => (
                            <li key={i} className="text-[#4b5563] text-sm flex items-start gap-2">
                              <span className="text-[#1e3a5f] mt-0.5">&#8226;</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.type === "options") {
              return (
                <div key={msg.id} className="flex gap-3">
                  <Image src="/logo.jpg" alt="CarSalesGuy" width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="space-y-3 max-w-lg">
                    {msg.content && (
                      <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 shadow-sm border border-[#e5e7eb]">
                        <p className="text-[#374151] text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pl-1">
                      {msg.options?.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onOptionClick(opt.value, opt.label)}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-xl text-sm font-medium border border-[#1e3a5f]/20 text-[#1e3a5f] bg-white hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === "assistant") {
              return (
                <div key={msg.id} className="flex gap-3">
                  <Image src="/logo.jpg" alt="CarSalesGuy" width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 max-w-lg shadow-sm border border-[#e5e7eb]">
                    <p className="text-[#374151] text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-[#1e3a5f] rounded-2xl rounded-tr-md px-5 py-3 max-w-sm shadow-sm">
                  <p className="text-white text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input bar */}
      {(awaitingInput || refineMode) && (
        <div className="bg-white border-t border-[#e5e7eb] px-4 sm:px-6 py-4 flex-shrink-0">
          <form onSubmit={handleInputSubmit} className="max-w-2xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getInputPlaceholder()}
              disabled={isLoading}
              className="flex-1 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#9ca3af] outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all disabled:opacity-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-xl px-5 py-3 text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
