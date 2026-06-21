import {
  LayoutGrid,
  PlayCircle,
  CheckCircle,
  Folder,
  Plus,
} from "lucide-react";
import type { Collection } from "../../types";

interface Props {
  collections: Collection[];
  active: string;
  onChange: (value: string) => void;
}

const staticFilters = [
  { id: "all", label: "All", icon: <LayoutGrid size={18} color="#4F46E5" /> },
  {
    id: "in-progress",
    label: "In progress",
    icon: <PlayCircle size={18} color="#6366F1" />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckCircle size={18} color="#22C55E" />,
  },
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
      icon: <Folder size={18} color={c.color} />,
    })),
    { id: "new", label: "New", icon: <Plus size={18} color="#BBB" /> },
  ];

  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-4 pt-1">
      {allFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`flex flex-col items-center gap-[6px] px-4 py-[10px] border rounded-[10px] cursor-pointer min-w-[72px] shrink-0 transition-colors ${
            active === filter.id
              ? "border-[#4F46E5] bg-[#EEF2FF]"
              : "border-[#EBEBEB] bg-white hover:border-[#C7D2FE] hover:bg-[#F5F3FF]"
          }`}
        >
          {filter.icon}
          <span
            className={`text-[11px] font-medium text-center leading-tight whitespace-nowrap ${
              active === filter.id ? "text-[#4338CA]" : "text-[#444]"
            }`}
          >
            {filter.label}
          </span>
        </button>
      ))}
    </div>
  );
}
