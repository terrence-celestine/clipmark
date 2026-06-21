import { LayoutGrid, PlayCircle, CheckCircle, Plus } from "lucide-react";
import type { Collection } from "../../types";

interface Props {
  collections: Collection[];
  active: string;
  onChange: (value: string) => void;
}

const staticFilters = [
  { id: "all", label: "All", icon: <LayoutGrid size={13} /> },
  { id: "in-progress", label: "In progress", icon: <PlayCircle size={13} /> },
  { id: "completed", label: "Completed", icon: <CheckCircle size={13} /> },
];

export default function CategoryStrip({
  collections,
  active,
  onChange,
}: Props) {
  const allFilters = [
    ...staticFilters,
    ...collections.map((c) => ({
      id: `collection-${c.id}`,
      label: c.name,
      icon: (
        <div
          className="w-[7px] h-[7px] rounded-full shrink-0"
          style={{ background: c.color }}
        />
      ),
    })),
    { id: "new", label: "New", icon: <Plus size={13} /> },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-px scrollbar-none md:flex-wrap">
      {allFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`flex items-center gap-[5px] px-3 py-[6px] rounded-full border text-[12px] shrink-0 transition-colors ${
            active === filter.id
              ? "bg-[#EEF2FF] border-[#C7D2FE] text-[#4338CA] font-medium"
              : "border-[#E8E8E8] bg-white text-[#666] hover:border-[#C7D2FE] hover:bg-[#F5F3FF]"
          }`}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
