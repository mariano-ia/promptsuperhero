"use client";

interface ActionButtonProps {
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function ActionButton({ onClick, loading, disabled }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="
        relative group w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base
        bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500
        text-white shadow-lg shadow-purple-900/40
        transition-all duration-300
        hover:scale-105 hover:shadow-xl hover:shadow-purple-800/50
        active:scale-100
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg
        overflow-hidden
      "
        >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

            <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Mejorando tu pedido…
                    </>
                ) : (
                    <>
                        <span>Mejorar mi pedido</span>
                        <span className="text-lg">✨</span>
                    </>
                )}
            </span>
        </button>
    );
}
