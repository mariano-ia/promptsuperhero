"use client";

interface PromptInputProps {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}

const MAX_CHARS = 500;

export default function PromptInput({ value, onChange, disabled }: PromptInputProps) {
    const remaining = MAX_CHARS - value.length;

    return (
        <div className="relative group">
            {/* Gradient border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/40 via-cyan-500/30 to-purple-600/40 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-colors duration-300 group-focus-within:border-white/20">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
                    disabled={disabled}
                    rows={5}
                    placeholder="¿Qué querés pedirle a la IA? Escribilo como se lo contarías a un amigo…"
                    className="w-full bg-transparent px-5 py-4 text-white placeholder:text-white/25 resize-none outline-none text-base leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {/* Character counter */}
                <div className="flex items-center justify-end px-5 py-2 border-t border-white/5">
                    <span
                        className={`text-xs font-mono transition-colors duration-300 ${remaining < 50 ? "text-rose-400" : remaining < 100 ? "text-amber-400" : "text-white/20"
                            }`}
                    >
                        {remaining} caracteres restantes
                    </span>
                </div>
            </div>
        </div>
    );
}
