"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import { getCannedAnswer } from "@/lib/canned-answers";

// ── Types ──

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "select";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  type: "text" | "options" | "email" | "loading" | "error";
  content?: string;
  options?: { label: string; value: string }[];
  emailResult?: { subject: string; body: string; tips: string[] };
}

// ── Field definitions per deal type + stage ──

function getFields(dealType: string, stage: string): FieldDef[] {
  if (["lease", "finance", "cash"].includes(dealType) && stage === "close") {
    return [
      { name: "name", label: "Full name", type: "text", required: true, placeholder: "First Last" },
      { name: "email", label: "Email address", type: "text", required: true, placeholder: "you@email.com" },
      { name: "phone", label: "Phone number", type: "text", required: true, placeholder: "(555) 123-4567" },
      { name: "deliveryPreference", label: "Delivery preference", type: "select", required: true, options: ["Pick up at dealership", "Home delivery"] },
      { name: "deliveryTiming", label: "Delivery timing", type: "select", required: true, options: ["Today", "Tomorrow", "This week"] },
    ];
  }

  if (dealType === "lease") {
    const base: FieldDef[] = [
      { name: "vehicle", label: "Vehicle", type: "text", required: true, placeholder: "e.g. 2026 BMW X5 xDrive40i" },
      { name: "term", label: "Lease term", type: "select", required: true, options: ["24 months", "27 months", "30 months", "33 months", "36 months", "39 months", "42 months", "48 months"] },
      { name: "milesPerYear", label: "Miles per year", type: "select", required: true, options: ["7,500", "10,000", "12,000", "15,000"] },
      { name: "downPayment", label: "Down payment / drive-off", type: "text", required: true, placeholder: "$0, $1,000, $2,000, etc." },
      { name: "zipCode", label: "Zip code", type: "text", required: true, placeholder: "90210" },
      { name: "name", label: "First name", type: "text", required: true, placeholder: "First name" },
      { name: "timePreference", label: "Timeline", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerQuote", label: "Dealer's quote", type: "text", required: true, placeholder: "$650/mo" },
        { name: "desiredPayment", label: "Your target payment", type: "text", required: true, placeholder: "$550/mo including tax" },
      );
    }
    return base;
  }

  if (dealType === "finance") {
    const base: FieldDef[] = [
      { name: "vehicle", label: "Vehicle", type: "text", required: true, placeholder: "e.g. 2026 Toyota 4Runner TRD Pro" },
      { name: "term", label: "Loan term", type: "select", required: true, options: ["36 months", "48 months", "60 months", "72 months", "84 months"] },
      { name: "downPayment", label: "Down payment", type: "text", required: true, placeholder: "$0, $2,000, $5,000, etc." },
      { name: "zipCode", label: "Zip code", type: "text", required: true, placeholder: "90210" },
      { name: "name", label: "First name", type: "text", required: true, placeholder: "First name" },
      { name: "timePreference", label: "Timeline", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerQuote", label: "Dealer's quote", type: "text", required: true, placeholder: "e.g. $45,000 selling price, $780/mo at 6.9% APR" },
        { name: "negotiationMetric", label: "Negotiate on", type: "select", required: true, options: ["Selling Price", "Monthly Payment", "OTD Price", "APR"] },
        { name: "desiredNumber", label: "Your target number", type: "text", required: true, placeholder: "Enter your target" },
      );
    }
    return base;
  }

  if (dealType === "cash") {
    const base: FieldDef[] = [
      { name: "vehicle", label: "Vehicle", type: "text", required: true, placeholder: "e.g. 2026 Lexus RX 350" },
      { name: "zipCode", label: "Zip code", type: "text", required: true, placeholder: "90210" },
      { name: "name", label: "First name", type: "text", required: true, placeholder: "First name" },
      { name: "timePreference", label: "Timeline", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
    if (stage === "counter") {
      base.push(
        { name: "dealerOTD", label: "Dealer's OTD quote", type: "text", required: true, placeholder: "$42,500" },
        { name: "desiredSellingPrice", label: "Target selling price (optional)", type: "text", required: false, placeholder: "Optional" },
        { name: "desiredOTD", label: "Target OTD price (optional)", type: "text", required: false, placeholder: "Optional" },
      );
    }
    return base;
  }

  if (dealType === "inventory") {
    return [
      { name: "vehicle", label: "Vehicle you're looking for", type: "text", required: true, placeholder: "e.g. 2026 Toyota Camry" },
      { name: "purchaseType", label: "How are you paying?", type: "select", required: true, options: ["Lease", "Finance", "Cash"] },
      { name: "name", label: "First name", type: "text", required: true, placeholder: "First name" },
      { name: "phone", label: "Phone number", type: "text", required: true, placeholder: "(555) 123-4567" },
      { name: "timePreference", label: "Timeline", type: "select", required: true, options: ["Today", "ASAP", "This week", "Soon"] },
    ];
  }

  return [];
}

// ── Deal type and stage configs ──

const dealTypes = [
  { value: "lease", label: "Lease", icon: "🔑", description: "Monthly payments, return at end" },
  { value: "finance", label: "Finance", icon: "🏦", description: "Loan to own the vehicle" },
  { value: "cash", label: "Cash", icon: "💵", description: "Buy outright, no payments" },
  { value: "inventory", label: "Inventory", icon: "🔍", description: "Find a specific vehicle" },
];

const stageMap: Record<string, { value: string; label: string; description: string }[]> = {
  lease: [
    { value: "quote", label: "Quote Request", description: "Get initial pricing from dealers" },
    { value: "counter", label: "Counter Offer", description: "Negotiate a better deal" },
    { value: "close", label: "Close the Deal", description: "Lock in and take delivery" },
  ],
  finance: [
    { value: "quote", label: "Quote Request", description: "Get initial pricing from dealers" },
    { value: "counter", label: "Counter Offer", description: "Negotiate a better deal" },
    { value: "close", label: "Close the Deal", description: "Lock in and take delivery" },
  ],
  cash: [
    { value: "quote", label: "Quote Request", description: "Get the best OTD price" },
    { value: "counter", label: "Counter Offer", description: "Push the price down" },
    { value: "close", label: "Close the Deal", description: "Lock in and take delivery" },
  ],
  inventory: [
    { value: "inquiry", label: "Inventory Check", description: "See what's available" },
    { value: "order", label: "Factory Order", description: "Order exactly what you want" },
  ],
};

// ── Main Component ──

export default function GeneratePage() {
  // Form state
  const [step, setStep] = useState(1);
  const [dealType, setDealType] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat / refinement state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [refineMode, setRefineMode] = useState(false);
  const [analyzeMode, setAnalyzeMode] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<{ subject: string; body: string } | null>(null);
  const [refineHistory, setRefineHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (refineMode || analyzeMode) {
      chatInputRef.current?.focus();
    }
  }, [refineMode, analyzeMode]);

  const totalSteps = 3;

  const handleDealTypeSelect = (value: string) => {
    setDealType(value);
    setStep(2);
  };

  const handleStageSelect = (value: string) => {
    setStage(value);
    const f = getFields(dealType!, value);
    setFields(f);
    setFormData({});
    setStep(3);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return fields.every((f) => !f.required || (formData[f.name] && formData[f.name].trim() !== ""));
  };

  // ── Generate email ──
  const generateEmail = async () => {
    setIsGenerating(true);
    setStep(4);

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

      if (data.type === "advice") {
        setMessages([
          { id: `advice-${Date.now()}`, role: "assistant", type: "text", content: data.message },
          { id: `advice-options-${Date.now()}`, role: "assistant", type: "options", content: undefined, options: [{ label: "Start a new deal", value: "__new_deal__" }] },
        ]);
      } else {
        const email = { subject: data.email.subject, body: data.email.body };
        setCurrentEmail(email);
        setRefineHistory([]);
        setRefineMode(true);

        setMessages([
          { id: `email-${Date.now()}`, role: "assistant", type: "email", emailResult: { subject: email.subject, body: email.body, tips: data.tips } },
          { id: `refine-prompt-${Date.now()}`, role: "assistant", type: "text", content: "Want to adjust anything? Tell me to change the tone, add details, make it shorter — or ask me anything about your deal." },
          { id: `next-options-${Date.now()}`, role: "assistant", type: "options", content: undefined, options: [{ label: "I'm good — what's next?", value: "__done__" }, { label: "Start a new deal", value: "__new_deal__" }] },
        ]);
      }
    } catch (err) {
      setMessages([
        { id: `error-${Date.now()}`, role: "assistant", type: "error", content: err instanceof Error ? err.message : "Something went wrong. Try again." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Chat refinement ──
  const handleRefine = async (userRequest: string) => {
    if (!currentEmail) return;

    const cannedAnswer = getCannedAnswer(userRequest);
    if (cannedAnswer) {
      setRefineHistory((prev) => [...prev, { role: "user", content: userRequest }, { role: "assistant", content: cannedAnswer }]);
      setMessages((prev) => [...prev, { id: `canned-${Date.now()}`, role: "assistant", type: "text", content: cannedAnswer }]);
      return;
    }

    setIsLoading(true);
    setMessages((prev) => [...prev, { id: `loading-${Date.now()}`, role: "assistant", type: "loading" }]);

    try {
      const response = await fetch("/api/refine-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentEmail, userRequest, conversationHistory: refineHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine email");
      }

      const data = await response.json();

      if (data.type === "email") {
        const newEmail = data.email;
        setCurrentEmail(newEmail);
        setRefineHistory((prev) => [...prev, { role: "user", content: userRequest }, { role: "assistant", content: `Updated the email. Subject: ${newEmail.subject}\n\n${newEmail.body}` }]);

        setMessages((prev) => {
          const filtered = prev.filter((m) => m.type !== "loading");
          const newMsgs: ChatMessage[] = [];
          if (data.message) newMsgs.push({ id: `refine-text-${Date.now()}`, role: "assistant", type: "text", content: data.message });
          newMsgs.push({ id: `email-${Date.now()}`, role: "assistant", type: "email", emailResult: { subject: newEmail.subject, body: newEmail.body, tips: [] } });
          newMsgs.push({ id: `refine-prompt-${Date.now()}`, role: "assistant", type: "text", content: "Anything else you want to change, or are you ready to send?" });
          newMsgs.push({ id: `next-options-${Date.now()}`, role: "assistant", type: "options", content: undefined, options: [{ label: "I'm good — what's next?", value: "__done__" }, { label: "Start a new deal", value: "__new_deal__" }] });
          return [...filtered, ...newMsgs];
        });
      } else {
        setRefineHistory((prev) => [...prev, { role: "user", content: userRequest }, { role: "assistant", content: data.message }]);
        setMessages((prev) => [...prev.filter((m) => m.type !== "loading"), { id: `advice-${Date.now()}`, role: "assistant", type: "text", content: data.message }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev.filter((m) => m.type !== "loading"), { id: `error-${Date.now()}`, role: "assistant", type: "error", content: err instanceof Error ? err.message : "Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Analyze dealer response ──
  const handleAnalyze = async (dealerResponse: string) => {
    setIsLoading(true);
    setAnalyzeMode(false);
    setMessages((prev) => [...prev, { id: `loading-${Date.now()}`, role: "assistant", type: "loading" }]);

    try {
      const response = await fetch("/api/analyze-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealType, formData, currentEmail, dealerResponse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze response");
      }

      const data = await response.json();

      const opts: { label: string; value: string }[] = [];
      if (data.recommendation === "counter" && stage !== "counter" && stage !== "close" && dealType !== "inventory") opts.push({ label: "Generate a counter offer", value: "__counter__" });
      if (data.recommendation === "accept" && stage !== "close" && dealType !== "inventory") opts.push({ label: "Close the deal", value: "__close__" });
      if (stage !== "counter" && stage !== "close" && dealType !== "inventory" && data.recommendation !== "counter") opts.push({ label: "Counter Offer", value: "__counter__" });
      if (stage !== "close" && dealType !== "inventory" && data.recommendation !== "accept") opts.push({ label: "Close the deal", value: "__close__" });
      opts.push({ label: "Analyze another response", value: "__analyze__" });
      opts.push({ label: "Start a new deal", value: "__new_deal__" });

      setMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        { id: `analysis-${Date.now()}`, role: "assistant", type: "text", content: data.analysis },
        { id: `analysis-options-${Date.now()}`, role: "assistant", type: "options", content: "What do you want to do next?", options: opts },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev.filter((m) => m.type !== "loading"), { id: `error-${Date.now()}`, role: "assistant", type: "error", content: err instanceof Error ? err.message : "Something went wrong." }]);
      setAnalyzeMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", type: "text", content: value }]);
    setChatInput("");
    if (analyzeMode) handleAnalyze(value);
    else if (refineMode) handleRefine(value);
  };

  const handleNextStep = (value: string) => {
    if (value === "__new_deal__") { resetAll(); return; }

    if (value === "__done__") {
      setRefineMode(false);
      const opts: { label: string; value: string }[] = [];
      if (dealType !== "inventory") opts.push({ label: "I got a response from a dealer", value: "__analyze__" });
      if (stage !== "counter" && stage !== "close" && dealType !== "inventory") opts.push({ label: "Counter Offer", value: "__counter__" });
      if (stage !== "close" && dealType !== "inventory") opts.push({ label: "Close the deal", value: "__close__" });
      opts.push({ label: "Start a new deal", value: "__new_deal__" });
      setMessages((prev) => [...prev, { id: `next-steps-${Date.now()}`, role: "assistant", type: "options", content: "Great — copy that email and send it to 3-5 dealers. What do you want to do next?", options: opts }]);
      return;
    }

    if (value === "__analyze__") {
      setRefineMode(false);
      setMessages((prev) => [...prev, { id: `analyze-prompt-${Date.now()}`, role: "assistant", type: "text", content: "Paste the dealer's response below — their email, text message, or quote. I'll break it down and tell you exactly what to do next." }]);
      setAnalyzeMode(true);
      return;
    }

    if (value === "__counter__" || value === "__close__") {
      const newStage = value === "__counter__" ? "counter" : "close";
      setStage(newStage);
      setRefineMode(false);
      setAnalyzeMode(false);
      setCurrentEmail(null);
      setRefineHistory([]);
      const newFields = getFields(dealType!, newStage);
      setFields(newFields);
      setFormData({ ...formData });
      setMessages([]);
      setStep(3);
      return;
    }
  };

  const resetAll = () => {
    setStep(1);
    setDealType(null);
    setStage(null);
    setFields([]);
    setFormData({});
    setMessages([]);
    setRefineMode(false);
    setAnalyzeMode(false);
    setCurrentEmail(null);
    setRefineHistory([]);
    setIsGenerating(false);
    setChatInput("");
  };

  // ── RENDER: Form Phase (Steps 1-3) ──
  const renderFormPhase = () => (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] py-4 px-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="CarSalesGuy" width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-bold text-[#0f172a]">CarSalesGuy<span className="text-[#10b981]"> AI</span></span>
          </Link>
          {step > 1 && (
            <button onClick={resetAll} className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#f1f5f9]">
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <span className="text-xs text-[#94a3b8]">
              {step === 1 && "Deal type"}
              {step === 2 && "Stage"}
              {step === 3 && "Your details"}
            </span>
          </div>
          <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div className="h-full bg-[#10b981] rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Form content */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Deal Type */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">What type of deal?</h2>
              <p className="text-[#64748b] mb-8">Select how you&apos;re buying your vehicle.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dealTypes.map((dt) => (
                  <button
                    key={dt.value}
                    onClick={() => handleDealTypeSelect(dt.value)}
                    className="group text-left p-6 rounded-2xl bg-white border-2 border-[#e2e8f0] hover:border-[#10b981] transition-all duration-200 hover:shadow-lg hover:shadow-[#10b981]/5"
                  >
                    <span className="text-2xl mb-3 block">{dt.icon}</span>
                    <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#10b981] transition-colors">{dt.label}</h3>
                    <p className="text-sm text-[#64748b] mt-1">{dt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Stage */}
          {step === 2 && dealType && (
            <div className="animate-fade-in-up">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">What stage are you at?</h2>
              <p className="text-[#64748b] mb-8">This determines the email strategy we use.</p>
              <div className="space-y-3">
                {stageMap[dealType]?.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStageSelect(s.value)}
                    className="group w-full text-left p-5 rounded-2xl bg-white border-2 border-[#e2e8f0] hover:border-[#10b981] transition-all duration-200 hover:shadow-lg hover:shadow-[#10b981]/5 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#f8fafc] group-hover:bg-[#10b981]/10 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-[#64748b] group-hover:text-[#10b981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a] group-hover:text-[#10b981] transition-colors">{s.label}</h3>
                      <p className="text-sm text-[#94a3b8]">{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details form */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">Your deal details</h2>
              <p className="text-[#64748b] mb-8">Fill in what you know — the more detail, the better your email.</p>

              <div className="space-y-5">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">
                      {field.label}
                      {!field.required && <span className="text-[#94a3b8] font-normal ml-1">(optional)</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="w-full bg-white border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={generateEmail}
                disabled={!isFormValid()}
                className="mt-8 w-full group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#10b981] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:bg-[#059669] hover:shadow-xl hover:shadow-[#10b981]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                Generate My Email
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  // ── RENDER: Result + Chat Phase (Step 4) ──
  const renderResultPhase = () => (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-[#0f172a]">
      <header className="bg-white border-b border-[#e2e8f0] py-4 px-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="CarSalesGuy" width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-bold text-[#0f172a]">CarSalesGuy<span className="text-[#10b981]"> AI</span></span>
          </Link>
          <button onClick={resetAll} className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#f1f5f9]">
            New Deal
          </button>
        </div>
      </header>

      {isGenerating && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <p className="text-[#64748b] font-medium">Crafting your negotiation email...</p>
            <p className="text-sm text-[#94a3b8] mt-1">This usually takes 5-10 seconds</p>
          </div>
        </div>
      )}

      {!isGenerating && (
        <>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
              {messages.map((msg) => {
                if (msg.type === "loading") {
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <Image src="/logo.jpg" alt="AI" width={32} height={32} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                      <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-sm border border-[#e2e8f0]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 bg-[#10b981] rounded-full animate-bounce [animation-delay:300ms]" />
                          <span className="text-[#94a3b8] text-sm ml-2">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.type === "error") {
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
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
                    <div key={msg.id} className="flex gap-3 animate-fade-in-up">
                      <Image src="/logo.jpg" alt="AI" width={32} height={32} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 max-w-xl space-y-3">
                        <div className="bg-white rounded-2xl rounded-tl-md overflow-hidden shadow-sm border border-[#e2e8f0]">
                          <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              <p className="text-sm font-semibold text-[#0f172a]">{subject}</p>
                            </div>
                          </div>
                          <div className="px-5 py-4">
                            <pre className="text-[#334155] text-sm whitespace-pre-wrap leading-relaxed font-[inherit]">{body}</pre>
                          </div>
                          <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc]">
                            <CopyButton text={fullText} />
                          </div>
                        </div>
                        {tips && tips.length > 0 && (
                          <div className="bg-[#10b981]/5 rounded-2xl px-5 py-4 border border-[#10b981]/10">
                            <p className="text-[#059669] text-xs font-bold uppercase tracking-wider mb-2">Pro tips</p>
                            <ul className="space-y-1.5">
                              {tips.map((tip, i) => (
                                <li key={i} className="text-[#334155] text-sm flex items-start gap-2">
                                  <span className="text-[#10b981] mt-0.5 flex-shrink-0">&#8226;</span>
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
                      <Image src="/logo.jpg" alt="AI" width={32} height={32} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                      <div className="space-y-3 max-w-lg">
                        {msg.content && (
                          <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 shadow-sm border border-[#e2e8f0]">
                            <p className="text-[#334155] text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pl-1">
                          {msg.options?.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleNextStep(opt.value)}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-[#e2e8f0] text-[#0f172a] bg-white hover:border-[#10b981] hover:text-[#059669] shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
                      <Image src="/logo.jpg" alt="AI" width={32} height={32} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                      <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 max-w-lg shadow-sm border border-[#e2e8f0]">
                        <p className="text-[#334155] text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-[#0f172a] rounded-2xl rounded-tr-md px-5 py-3 max-w-sm shadow-sm">
                      <p className="text-white text-sm">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </main>

          {(refineMode || analyzeMode) && (
            <div className="bg-white border-t border-[#e2e8f0] px-4 sm:px-6 py-4 flex-shrink-0">
              <form onSubmit={handleChatSubmit} className="max-w-2xl mx-auto flex gap-3">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={analyzeMode ? "Paste the dealer's response here..." : "Ask me to change the email, or ask about your deal..."}
                  disabled={isLoading}
                  className="flex-1 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10 transition-all disabled:opacity-50"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl px-5 py-3 text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (step === 4) return renderResultPhase();
  return renderFormPhase();
}
