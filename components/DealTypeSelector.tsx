"use client";

const dealTypes = [
  { id: "lease", icon: "📋", label: "Lease", description: "Leasing a new vehicle" },
  { id: "finance", icon: "💰", label: "Finance", description: "Financing with a loan" },
  { id: "cash", icon: "💵", label: "Cash Purchase", description: "Buying outright with cash" },
  { id: "inventory", icon: "🔍", label: "Inventory", description: "Finding a vehicle or placing an order" },
];

interface DealTypeSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
}

export default function DealTypeSelector({ selected, onSelect }: DealTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {dealTypes.map((type) => {
        const isSelected = selected === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              isSelected
                ? "border-[#3b82f6] bg-[#1f2937]"
                : "border-gray-700 bg-[#1f2937] hover:border-gray-500"
            }`}
          >
            <span className="text-4xl mb-3">{type.icon}</span>
            <span className="text-white font-bold text-lg mb-1">{type.label}</span>
            <span className="text-[#9ca3af] text-sm text-center">{type.description}</span>
          </button>
        );
      })}
    </div>
  );
}
