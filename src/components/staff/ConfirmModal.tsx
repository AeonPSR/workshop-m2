import React from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1a1a] border border-[#FF9228]/30 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm text-white/70">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 border border-white/20 cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
