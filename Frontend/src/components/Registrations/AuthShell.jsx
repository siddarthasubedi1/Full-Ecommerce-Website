
import { useState } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function AuthShell({ children, compact = false }) {
    const [dark, setDark] = useState(false);

    return (
        <main className="min-h-screen bg-[#202126] px-4 py-7 flex items-center justify-center">
            <div
                className={`
          relative isolate w-full max-w-[445px] overflow-hidden
          rounded-[32px] border border-white/70
          bg-gradient-to-br from-[#f3f7ff] via-[#e0ebfc] to-[#cfdffb]
          px-7 pb-8 pt-16 sm:px-12
          shadow-[0_32px_90px_#0007]
          ${compact ? "min-h-[700px]" : "min-h-[760px]"}
          ${dark ? "brightness-[.78]" : ""}
        `}
            >
                {/* Top left circle */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 -top-32
          h-64 w-64 rounded-full border-[18px] border-[#a8c8ff]
          bg-gradient-to-br from-white to-[#c4d9ff]
          shadow-[0_0_10px_white,0_12px_22px_#4080ed80]"
                />

                {/* Right circle */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 top-40
          h-36 w-36 rounded-full border border-white/80
          bg-gradient-to-br from-[#f7fbff] to-[#9dbdff]
          shadow-[0_10px_24px_#5085df55]"
                />

                {/* Bottom circle */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-36 -left-24
          h-56 w-56 rounded-full border-[16px] border-[#b4d1ff]
          bg-gradient-to-tr from-white to-[#b8d0ff]
          shadow-[0_0_8px_white]"
                />

                {/* Theme toggle */}
                <button
                    type="button"
                    onClick={() => setDark((v) => !v)}
                    aria-label={dark ? "Use light theme" : "Use dark theme"}
                    className="absolute right-5 top-5 z-20 grid h-11 w-11
          place-items-center rounded-2xl border border-white/80
          bg-gradient-to-br from-white to-[#cbdcff]
          text-[#08194d] shadow-[0_6px_12px_#4d77bd55]
          transition-transform hover:scale-105"
                >
                    {dark ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} fill="currentColor" />
                    )}
                </button>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Flame logo container */}
                    <div
                        className="mb-6 grid h-[164px] w-[164px] place-items-center
            rounded-[48px] border border-white/90
            bg-gradient-to-br from-white/90 to-[#d5e4fd]
            shadow-[inset_0_2px_6px_white,0_16px_24px_#6695db66]"
                    >
                        <svg
                            className="drop-shadow-[0_8px_6px_#376ee366]"
                            width="96"
                            height="112"
                            viewBox="0 0 96 112"
                            fill="none"
                            role="img"
                            aria-label="Blue flame"
                        >
                            <defs>
                                <linearGradient
                                    id="fireOne"
                                    x1="17"
                                    y1="90"
                                    x2="85"
                                    y2="12"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#0335df" />
                                    <stop offset="0.55" stopColor="#188aff" />
                                    <stop offset="1" stopColor="#eaf5ff" />
                                </linearGradient>

                                <linearGradient
                                    id="fireTwo"
                                    x1="12"
                                    y1="98"
                                    x2="70"
                                    y2="28"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#0533cc" />
                                    <stop offset=".55" stopColor="#086aff" />
                                    <stop offset="1" stopColor="#7ecbff" />
                                </linearGradient>

                                <linearGradient
                                    id="fireThree"
                                    x1="40"
                                    y1="84"
                                    x2="73"
                                    y2="4"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#2477f4" />
                                    <stop offset="1" stopColor="#fff" />
                                </linearGradient>
                            </defs>

                            <path
                                d="M57 3C42 24 57 33 67 45c12 14 7 28-5 38 5-20-21-26-27-43-5-15 7-31 22-37Z"
                                fill="url(#fireThree)"
                            />

                            <path
                                d="M33 29C16 49 28 58 48 70c17 10 16 24 3 37 3-20-32-22-39-44-5-14 7-27 21-34Z"
                                fill="url(#fireOne)"
                            />

                            <path
                                d="M49 22C32 48 58 54 69 67c12 15 4 25-7 32 2-17-21-22-30-36-7-11 3-29 17-41Z"
                                fill="url(#fireTwo)"
                                opacity=".97"
                            />
                        </svg>
                    </div>

                    {/* Login or registration form */}
                    {children}

                    {/* Footer */}
                    <div
                        className="mt-12 flex flex-wrap justify-center gap-2
            text-[9px] font-bold tracking-[.23em] text-[#61779e]"
                    >
                        <span>CREATE</span>
                        <span>•</span>
                        <span>CONNECT</span>
                        <span>•</span>
                        <span>GROW TOGETHER</span>
                    </div>
                </div>

                <div
                    className="absolute bottom-4 right-4 text-[#8ca8d8]"
                    aria-hidden="true"
                >
                    <Sparkles size={18} />
                </div>
            </div>
        </main>
    );
}
