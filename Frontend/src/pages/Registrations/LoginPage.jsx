

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { ArrowRight } from "lucide-react";
// import InputField from "../../components/Registrations/InputField";
// import AuthShell from "../../components/Registrations/AuthShell";
// import { loginUser } from "../../services/authService";

// export default function LoginPage() {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({
//         email: "",
//         password: "",
//     });

//     const [error, setError] = useState("");
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [remember, setRemember] = useState(false);

//     useEffect(() => {
//         if (!message) return;

//         const timer = setTimeout(() => setMessage(""), 5000);
//         return () => clearTimeout(timer);
//     }, [message]);

//     const handleChange = (e) => {
//         setForm((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setError("");
//         setMessage("");
//         setLoading(true);

//         try {
//             const data = await loginUser(form);

//             const target = remember ? localStorage : sessionStorage;
//             const other = remember ? sessionStorage : localStorage;

//             other.removeItem("accessToken");
//             other.removeItem("refreshToken");

//             if (data.token?.access) {
//                 target.setItem("accessToken", data.token.access);
//             }

//             if (data.token?.refresh) {
//                 target.setItem("refreshToken", data.token.refresh);
//             }

//             setMessage(data.message || "Login successful.");
//             window.dispatchEvent(new Event("auth-changed"));
//             navigate("/", { replace: true });
//             setForm({ email: "", password: "" });
//         } catch (err) {
//             setError(
//                 err.message || "Login failed. Please check your details."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <AuthShell compact>
//             {/* Heading */}
//             <div className="mb-6 text-center">
//                 <h1 className="text-3xl font-extrabold text-[#071637]">
//                     Welcome Back
//                 </h1>

//                 <p className="mt-2 text-xs tracking-[0.32em] text-[#61779e]">
//                     SIGN IN TO CONTINUE
//                 </p>
//             </div>

//             {/* Login Form */}
//             <form
//                 onSubmit={handleSubmit}
//                 className="flex w-full flex-col gap-4"
//             >
//                 {/* Error Message */}
//                 {error && (
//                     <div
//                         role="alert"
//                         className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
//                     >
//                         {error}
//                     </div>
//                 )}

//                 {/* Success Message */}
//                 {message && (
//                     <div
//                         role="status"
//                         className="rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700"
//                     >
//                         {message}
//                     </div>
//                 )}

//                 {/* Email */}
//                 <InputField
//                     label="Email address"
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="Email Address"
//                     autoComplete="email"
//                 />

//                 {/* Password */}
//                 <InputField
//                     label="Password"
//                     name="password"
//                     type="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     placeholder="Password"
//                     autoComplete="current-password"
//                 />

//                 {/* Remember Me and Forgot Password */}
//                 <div className="flex items-center justify-between py-1">
//                     <label className="flex cursor-pointer items-center gap-2 text-xs text-[#2b4069]">
//                         <input
//                             type="checkbox"
//                             checked={remember}
//                             onChange={(e) => setRemember(e.target.checked)}
//                             className="h-4 w-4 accent-blue-600"
//                         />
//                         Remember Me
//                     </label>

//                     <span
//                         className="text-xs font-medium text-[#1963eb]"
//                         title="Password recovery is not implemented"
//                     >
//                         Forgot Password?
//                     </span>
//                 </div>

//                 {/* Login Button */}
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="
//             relative mt-2 flex h-14 w-full
//             items-center justify-center
//             rounded-full
//             border border-[#80b3ff]
//             bg-gradient-to-r
//             from-[#2fa1ff]
//             via-[#1253ed]
//             to-[#4939de]
//             text-lg font-semibold text-white
//             shadow-[0_9px_17px_#486cef88,inset_0_2px_5px_#a0d2ff]
//             transition-all duration-300
//             hover:scale-[1.02]
//             hover:brightness-110
//             active:scale-[0.98]
//             disabled:cursor-not-allowed
//             disabled:opacity-60
//           "
//                 >
//                     <span>{loading ? "Signing in..." : "Login"}</span>

//                     <span
//                         className="
//               absolute right-3
//               grid h-9 w-9
//               place-items-center
//               rounded-full
//               bg-white/15
//               shadow-[0_2px_8px_#112eb188]
//             "
//                     >
//                         <ArrowRight size={22} />
//                     </span>
//                 </button>
//             </form>

//             {/* Divider */}
//             <div className="my-7 flex w-full items-center gap-3">
//                 <div className="h-px flex-1 bg-[#9cb7e3]" />

//                 <span className="text-[10px] font-bold tracking-[0.25em] text-[#6a83ad]">
//                     NEW HERE?
//                 </span>

//                 <div className="h-px flex-1 bg-[#9cb7e3]" />
//             </div>

//             {/* Registration Link */}
//             <p className="text-center text-sm text-[#516b98]">
//                 Don't have an account?{" "}
//                 <Link
//                     to="/register"
//                     className="font-semibold text-[#1762ee] transition-colors hover:text-blue-800"
//                 >
//                     Create account
//                 </Link>
//             </p>
//         </AuthShell>
//     );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/account/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.message || "Login failed");
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            window.dispatchEvent(new Event("auth-changed"));
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f3ef] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl p-8 md:p-10">
                <h1 className="text-3xl font-extrabold text-[#102342] text-center mb-6">Login</h1>
                {error && <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-red-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-red-700 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}