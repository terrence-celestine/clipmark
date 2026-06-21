import { X, AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl border border-[#E8E8E8] w-[380px] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div>
            <h2 className="text-[14px] font-medium text-[#111] mb-1">
              {title}
            </h2>
            <p className="text-[12px] text-[#999] leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[#CCC] hover:text-[#888] ml-auto"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-[12px] text-[#888] bg-white border border-[#E8E8E8] rounded-[7px] px-4 py-[7px] hover:bg-[#F5F5F5]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-[12px] font-medium text-white bg-red-500 rounded-[7px] px-4 py-[7px] hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
