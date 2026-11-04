import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("access"));
        };
        checkAuth();
        window.addEventListener("storage", checkAuth);
        window.addEventListener("auth-changed", checkAuth);
        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-changed", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/login");
    };

    const linkStyle = "text-xl font-bold text-slate-800 hover:text-red-700 transition-colors";
    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
                <Link to="/">
                    <h1 className="font-bold text-3xl">
                        <span className="text-red-700 text-4xl font-serif">
                            S
                        </span>
                        iddarth
                        <span className="text-red-700 text-3xl font-serif">
                            a
                        </span>
                    </h1>
                </Link>
                <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex text-2xl">
                    <Link className={linkStyle} to="/">Home</Link>
                    <Link className={linkStyle} to="/product">Products</Link>
                    <Link className={linkStyle} to="/about">About</Link>
                    <Link className={linkStyle} to="/contact">Contact</Link>
                </nav>
                <div className="hidden items-center gap-4 md:flex">
                    <Link to="/product" aria-label="Browse products" className="text-slate-700 hover:text-red-700"><Search size={21} /></Link>
                    <Link to="/cart" aria-label="Shopping cart" className="text-slate-700 hover:text-red-700"><ShoppingCart size={22} /></Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="rounded-lg border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-lg border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white">Login</Link>
                            <Link to="/register" className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Register</Link>
                        </>
                    )}
                </div>
                <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-800 hover:bg-slate-100 md:hidden">
                    {menuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </div>
            {menuOpen && (
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1 border-t border-slate-100 bg-white px-5 py-3 md:hidden">
                    {[["Home", "/"], ["Products", "/product"], ["About", "/about"], ["Contact", "/contact"], ["Cart", "/cart"]].map(([label, href]) => (
                        <Link key={href} to={href} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-700">{label}</Link>
                    ))}
                    {isLoggedIn ? (
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm font-semibold text-red-700">Logout</button>
                    ) : (
                        <div className="flex gap-3 px-3 py-2">
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-700">Login</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Register</Link>
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}
