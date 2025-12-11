import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-600/20 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                    {title || "Confirm Action"}
                </h3>

                {/* Message */}
                <p className="text-gray-400 text-center mb-6 text-sm leading-relaxed">
                    {message || "Are you sure you want to proceed?"}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-800/50 text-gray-300 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
