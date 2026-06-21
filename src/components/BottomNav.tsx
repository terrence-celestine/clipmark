import { LayoutGrid, Folder, Plus, Search, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  onAddVideo: () => void;
}

export default function BottomNav({ onAddVideo }: Props) {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EFEFEF] flex items-center pb-safe z-40 md:hidden">
      <Link
        to="/"
        className={`flex-1 flex flex-col items-center gap-[3px] py-2 text-[10px] ${pathname === "/" ? "text-[#4F46E5]" : "text-[#BBB]"}`}
      >
        <LayoutGrid size={20} />
        Library
      </Link>

      <Link
        to="/collections"
        className={`flex-1 flex flex-col items-center gap-[3px] py-2 text-[10px] ${pathname === "/collections" ? "text-[#4F46E5]" : "text-[#BBB]"}`}
      >
        <Folder size={20} />
        Collections
      </Link>

      <div className="flex-1 flex flex-col items-center gap-[3px] py-2 relative">
        <button
          onClick={onAddVideo}
          className="w-11 h-11 bg-[#4F46E5] rounded-[14px] flex items-center justify-center absolute -top-5 border-3 border-[#FAFAFA]"
          style={{ border: "3px solid #FAFAFA" }}
          aria-label="Add video"
        >
          <Plus size={20} color="white" />
        </button>
        <span className="text-[10px] text-[#BBB] mt-7">Add</span>
      </div>

      <Link
        to="/search"
        className={`flex-1 flex flex-col items-center gap-[3px] py-2 text-[10px] ${pathname === "/search" ? "text-[#4F46E5]" : "text-[#BBB]"}`}
      >
        <Search size={20} />
        Search
      </Link>

      <Link
        to="/settings"
        className={`flex-1 flex flex-col items-center gap-[3px] py-2 text-[10px] ${pathname === "/settings" ? "text-[#4F46E5]" : "text-[#BBB]"}`}
      >
        <Settings size={20} />
        Settings
      </Link>
    </nav>
  );
}
