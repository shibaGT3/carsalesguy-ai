"use client";

const stagesByDealType: Record<string, { value: string; label: string; description: string }[]> = {
  lease: [
    { value: "quote", label: "Quote Request", description: "Get your first quote from the dealer" },
    { value: "counter", label: "Counter Offer", description: "Negotiate after receiving a quote" },
    { value: "close", label: "Close", description: "Finalize the deal and take delivery" },
  ],
  finance: [
    { value: "quote", label: "Quote Request", description: "Get your first quote from the dealer" },
    { value: "counter", label: "Counter Offer", description: "Negotiate after receiving a quote" },
    { value: "close", label: "Close", description: "Finalize the deal and take delivery" },
  ],
  cash: [
    { value: "quote", label: "Quote Request", description: "Get your first quote from the dealer" },
    { value: "counter", label: "Counter Offer", description: "Negotiate after receiving a quote" },
    { value: "close", label: "Close", description: "Finalize the deal and take delivery" },
  ],
  inventory: [
    { value: "inquiry", label: "Inquiry", description: "Ask about vehicle availability" },
    { value: "order", label: "Factory Order", description: "Place a custom factory order" },
  ],
};

interface StageSelectorProps {
  dealType: string;
  selected: string;
  onSelect: (stage: string) => void;
}

export default function StageSelector({ dealType, selected, onSelect }: StageSelectorProps) {
  const stages = stagesByDealType[dealType] || [];

  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => {
        const isSelected = selected === stage.value;
        return (
          <button
            key={stage.value}
            onClick={() => onSelect(stage.value)}
            title={stage.description}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-[#3b82f6] text-white"
                : "bg-[#1f2937] text-[#9ca3af] hover:bg-gray-700 hover:text-white"
            }`}
          >
            {stage.label}
          </button>
        );
      })}
    </div>
  );
}
