

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
            localStorage.setItem("access", data.token.access);
            localStorage.setItem("refresh", data.token.refresh);
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