import { useState, useEffect } from "react";
import { getCollections } from "../db/helpers";
import type { Collection } from "../types";
import CategoryStrip from "../components/home/CategoryStrip";

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    getCollections().then(setCollections);
  }, []);

  return (
    <div className="flex flex-col flex-1 px-5 pt-5">
      <div className="bg-white border-b border-[#EFEFEF] -mx-5 px-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[16px] font-medium text-[#111]">
              Your library
            </h1>
            <p className="text-[12px] text-[#999] mt-[2px]">
              0 videos · 0 chapters marked
            </p>
          </div>
        </div>
        <CategoryStrip
          collections={collections}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>
    </div>
  );
}
