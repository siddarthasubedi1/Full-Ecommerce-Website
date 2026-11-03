
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const Icon = isPassword
    ? LockKeyhole
    : type === "email"
      ? Mail
      : UserRound;

  return (
    <div className="relative w-full">
      {/* Accessible label */}
      <label htmlFor={name} className="sr-only">
        {label}
      </label>

      {/* Input icon */}
      <Icon
        size={21}
        strokeWidth={2.1}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#58729d]"
        aria-hidden="true"
      />

      {/* Input field */}
      <input
        id={name}
        name={name}
        type={
          isPassword && showPassword
            ? "text"
            : type
        }
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        autoComplete={autoComplete}
        className="
          h-14 w-full
          rounded-[20px]
          border border-white/90
          bg-gradient-to-b
          from-[#e9f1ff]
          to-[#d4e2fa]
          pl-14 pr-12
          text-sm text-[#182b55]
          placeholder:text-[#657b9f]
          shadow-[inset_0_2px_3px_#fff,0_8px_13px_#819dc454]
          outline-none
          transition
          focus:ring-2
          focus:ring-[#4b8eff]
        "
      />

      {/* Password visibility toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          className="
            absolute right-4 top-1/2
            -translate-y-1/2
            text-[#657b9f]
            transition-colors
            hover:text-[#1b5af2]
          "
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      )}
    </div>
  );
}
