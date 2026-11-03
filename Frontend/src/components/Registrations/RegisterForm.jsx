
// import { useEffect, useState } from "react";
// import { ArrowRight } from "lucide-react";
// import InputField from "./InputField";
// import usePasswordStrength from "../../hooks/usePasswordStrength";
// import registerUser from "../../services/authService";

// const initialForm = {
//     name: "",
//     email: "",
//     password: "",
//     password2: "",
//     tc: false,
// };

// export default function RegisterForm() {
//     const [form, setForm] = useState(initialForm);
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const passwordStrength = usePasswordStrength(form.password);

//     useEffect(() => {
//         if (!message) return;

//         const timer = setTimeout(() => setMessage(""), 5000);
//         return () => clearTimeout(timer);
//     }, [message]);

//     const handleChange = (e) => {
//         const { name, value, checked, type } = e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setMessage("");

//         if (form.password !== form.password2) {
//             setError("Passwords do not match.");
//             return;
//         }

//         if (!form.tc) {
//             setError("Please accept the terms and conditions.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const data = await registerUser(form);

//             setMessage(data.msg || "Registration successful!");
//             setForm(initialForm);
//         } catch (err) {
//             setError(err.message || "Registration failed.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="flex w-full flex-col gap-3"
//         >
//             {/* Error message */}
//             {error && (
//                 <div
//                     role="alert"
//                     className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
//                 >
//                     {error}
//                 </div>
//             )}

//             {/* Success message */}
//             {message && (
//                 <div
//                     role="status"
//                     className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800"
//                 >
//                     {message}
//                 </div>
//             )}

//             {/* Full Name */}
//             <InputField
//                 label="Full name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 autoComplete="name"
//             />

//             {/* Email */}
//             <InputField
//                 label="Email address"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 autoComplete="email"
//             />

//             {/* Password */}
//             <InputField
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Create Password"
//                 autoComplete="new-password"
//             />

//             {/* Password strength */}
//             {form.password && (
//                 <div className="rounded-2xl bg-white/40 p-3 text-xs text-[#49638d]">
//                     <div className="mb-2 flex justify-between">
//                         <span>Password strength</span>
//                         <strong>{passwordStrength.label}</strong>
//                     </div>

//                     <div className="h-2 overflow-hidden rounded-full bg-[#c1d2ef]">
//                         <div
//                             className="h-full rounded-full bg-[#2563eb] transition-all"
//                             style={{
//                                 width: `${passwordStrength.score * 20}%`,
//                             }}
//                         />
//                     </div>

//                     <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
//                         {passwordStrength.checks.map((check) => (
//                             <li key={check.label}>
//                                 {check.passed ? "✓" : "○"} {check.label}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Confirm Password */}
//             <InputField
//                 label="Confirm password"
//                 name="password2"
//                 type="password"
//                 value={form.password2}
//                 onChange={handleChange}
//                 placeholder="Confirm Password"
//                 autoComplete="new-password"
//             />

//             {/* Terms and Conditions */}
//             <label className="flex items-center gap-2 py-1 text-xs text-[#2b4069]">
//                 <input
//                     type="checkbox"
//                     name="tc"
//                     checked={form.tc}
//                     onChange={handleChange}
//                     className="h-4 w-4 accent-blue-600"
//                 />

//                 <span>I accept the terms and conditions</span>
//             </label>

//             {/* Register Button */}
//             <button
//                 type="submit"
//                 disabled={loading}
//                 className="
//           relative mt-2 flex h-14 w-full
//           items-center justify-center
//           rounded-full
//           border border-[#80b3ff]
//           bg-gradient-to-r
//           from-[#2fa1ff]
//           via-[#1253ed]
//           to-[#4939de]
//           text-lg font-semibold text-white
//           shadow-[0_9px_17px_#486cef88,inset_0_2px_5px_#a0d2ff]
//           transition
//           hover:brightness-110
//           disabled:cursor-not-allowed
//           disabled:opacity-60
//         "
//             >
//                 <span>
//                     {loading ? "Creating account..." : "Register"}
//                 </span>

//                 <span
//                     className="
//             absolute right-3 grid h-9 w-9
//             place-items-center rounded-full
//             bg-white/15
//             shadow-[0_2px_8px_#112eb188]
//           "
//                 >
//                     <ArrowRight size={22} />
//                 </span>
//             </button>
//         </form>
//     );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import InputField from "./InputField";
import usePasswordStrength from "../../hooks/usePasswordStrength";
import registerUser from "../../services/authService";

const initialForm = {
    name: "",
    email: "",
    password: "",
    password2: "",
    tc: false,
};

export default function RegisterForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordStrength = usePasswordStrength(form.password);

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => setMessage(""), 5000);
        return () => clearTimeout(timer);
    }, [message]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (form.password !== form.password2) {
            setError("Passwords do not match.");
            return;
        }

        if (!form.tc) {
            setError("Please accept the terms and conditions.");
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser(form);

            // Registration returns JWT tokens; store them for the current session.
            if (data.token?.access) sessionStorage.setItem("accessToken", data.token.access);
            if (data.token?.refresh) sessionStorage.setItem("refreshToken", data.token.refresh);
            window.dispatchEvent(new Event("auth-changed"));
            setMessage(data.message || "Registration successful!");
            navigate("/", { replace: true });
            setForm(initialForm);
        } catch (err) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3"
        >
            {/* Error message */}
            {error && (
                <div
                    role="alert"
                    className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {/* Success message */}
            {message && (
                <div
                    role="status"
                    className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800"
                >
                    {message}
                </div>
            )}

            {/* Full Name */}
            <InputField
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                autoComplete="name"
            />

            {/* Email */}
            <InputField
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                autoComplete="email"
            />

            {/* Password */}
            <InputField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create Password"
                autoComplete="new-password"
            />

            {/* Password strength */}
            {form.password && (
                <div className="rounded-2xl bg-white/40 p-3 text-xs text-[#49638d]">
                    <div className="mb-2 flex justify-between">
                        <span>Password strength</span>
                        <strong>{passwordStrength.label}</strong>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#c1d2ef]">
                        <div
                            className="h-full rounded-full bg-[#2563eb] transition-all"
                            style={{
                                width: `${passwordStrength.score * 20}%`,
                            }}
                        />
                    </div>

                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                        {passwordStrength.checks.map((check) => (
                            <li key={check.label}>
                                {check.passed ? "✓" : "○"} {check.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Confirm Password */}
            <InputField
                label="Confirm password"
                name="password2"
                type="password"
                value={form.password2}
                onChange={handleChange}
                placeholder="Confirm Password"
                autoComplete="new-password"
            />

            {/* Terms and Conditions */}
            <label className="flex items-center gap-2 py-1 text-xs text-[#2b4069]">
                <input
                    type="checkbox"
                    name="tc"
                    checked={form.tc}
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-600"
                />

                <span>I accept the terms and conditions</span>
            </label>

            {/* Register Button */}
            <button
                type="submit"
                disabled={loading}
                className="
          relative mt-2 flex h-14 w-full
          items-center justify-center
          rounded-full
          border border-[#80b3ff]
          bg-gradient-to-r
          from-[#2fa1ff]
          via-[#1253ed]
          to-[#4939de]
          text-lg font-semibold text-white
          shadow-[0_9px_17px_#486cef88,inset_0_2px_5px_#a0d2ff]
          transition
          hover:brightness-110
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
            >
                <span>
                    {loading ? "Creating account..." : "Register"}
                </span>

                <span
                    className="
            absolute right-3 grid h-9 w-9
            place-items-center rounded-full
            bg-white/15
            shadow-[0_2px_8px_#112eb188]
          "
                >
                    <ArrowRight size={22} />
                </span>
            </button>
        </form>
    );
}