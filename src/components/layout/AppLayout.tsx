import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import TopNav from "./TopNav";
import BottomNav from "../BottomNav";
import AddVideoModal from "../home/AddVideoModal";

export default function AppLayout() {
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <TopNav />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav onAddVideo={() => setShowAddModal(true)} />
      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => navigate(0)}
        />
      )}
    </div>
  );
}
