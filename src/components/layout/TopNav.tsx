import { Bookmark, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import AddVideoModal from "../home/AddVideoModal";

const navLinks = [
  { label: "Library", path: "/" },
  { label: "Collections", path: "/collections" },
  { label: "Recently watched", path: "/recent" },
];

export default function TopNav() {
  const { pathname } = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <nav className="h-[52px] flex items-center px-4 md:px-5 border-b border-[#EFEFEF] bg-white gap-3 shrink-0">
        <Link to="/" className="flex items-center gap-2 mr-4 md:mr-6 shrink-0">
          <div className="w-[26px] h-[26px] bg-[#4F46E5] rounded-[7px] flex items-center justify-center">
            <Bookmark size={13} color="white" />
          </div>
          <span className="text-[15px] font-medium text-[#111] tracking-tight">
            ClipMark
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[13px] px-3 py-[5px] rounded-md transition-colors ${
                pathname === link.path
                  ? "text-[#4F46E5] font-medium"
                  : "text-[#666] hover:text-[#111] hover:bg-[#F5F5F5]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="w-[30px] h-[30px] rounded-[7px] border border-[#E8E8E8] flex items-center justify-center text-[#888] md:hidden">
            <Search size={15} />
          </button>
        </div>
      </nav>

      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => window.location.reload()}
        />
      )}
    </>
  );
}
