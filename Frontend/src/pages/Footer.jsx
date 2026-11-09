import {
    Mail,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="w-full font-sans ml-10 mr-12 mt-10">
            {/* ── 1. Top Newsletter Banner ── */}
            <div className="relative overflow-hidden bg-[#08162e] px-4 py-6 text-white sm:px-8 lg:px-16">
                {/* Far-left Orange Angled Decorative Shape */}
                <div className="absolute -left-10 top-0 bottom-0 hidden w-28 -skew-x-12 bg-[#f97316] md:block" />

                <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 lg:flex-row">
                    {/* Left: Envelope Icon + Text */}
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[#f97316] text-[#f97316]">
                            <Mail size={26} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-wider uppercase text-white sm:text-lg">
                                JOIN THE PAJJI STORE FAMILY
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-300 sm:text-sm">
                                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                            </p>
                        </div>
                    </div>

                    {/* Right: Email Input & Subscribe Button */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex w-full max-w-lg items-center overflow-hidden rounded-md bg-white shadow-md"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 text-xs font-medium text-gray-800 outline-none sm:text-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="flex shrink-0 items-center gap-1.5 bg-[#f97316] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ea580c]"
                        >
                            SUBSCRIBE
                            <ChevronRight size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ── 2. Middle Main Footer Section ── */}
            <div className="border-b border-gray-200/80 bg-[#f7f5f1] px-4 py-12 sm:px-8 lg:px-16">
                <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Col 1: Brand Info & Socials */}
                    <div className="space-y-4">
                        <div className="flex gap-7 items-center">
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
                        </div>
                        <p className="max-w-xs text-xs leading-relaxed text-gray-600">
                            Pajji Store delivers quality products you can trust, at prices you&apos;ll love. Your satisfaction is our priority.
                        </p>

                        {/* Social Icons (SVGs) */}
                        <div className="flex items-center gap-3 pt-2 text-gray-800">
                            {/* Facebook */}
                            <a href="#" className="transition-colors hover:text-[#f97316]" aria-label="Facebook">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="transition-colors hover:text-[#f97316]" aria-label="Instagram">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            {/* Pinterest */}
                            <a href="#" className="transition-colors hover:text-[#f97316]" aria-label="Pinterest">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.762.098.123.112.23.083.355-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.697-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.217 0-2.361-.633-2.753-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                </svg>
                            </a>
                            {/* TikTok */}
                            <a href="#" className="transition-colors hover:text-[#f97316]" aria-label="TikTok">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.29 2.57.01.8.38 1.58.98 2.09.84.72 2.05.88 3.01.4 1.01-.48 1.65-1.52 1.63-2.63.02-5.37.01-10.74.01-16.11z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="#" className="transition-colors hover:text-[#f97316]" aria-label="YouTube">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Shop */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#08162e]">
                            SHOP
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">All Products</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Best Sellers</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">New Arrivals</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Track Order</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Deals</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Customer Service */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#08162e]">
                            CUSTOMER SERVICE
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Contact Us</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Shipping Policy</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Return & Refund Policy</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">FAQ</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Size Guide</a></li>
                        </ul>
                    </div>

                    {/* Col 4: About Us */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#08162e]">
                            ABOUT US
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">About PAJJI STORE</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Our Story</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Careers</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Privacy Policy</a></li>
                            <li><a href="#" className="transition-colors hover:text-[#f97316]">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* Col 5: We Accept Badges */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#08162e]">
                            WE ACCEPT
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* VISA */}
                            <div className="flex h-8 items-center justify-center rounded border border-gray-200 bg-white px-2.5 shadow-sm">
                                <span className="text-xs font-black italic tracking-widest text-[#1a1f71]">VISA</span>
                            </div>
                            {/* Mastercard */}
                            <div className="flex h-8 items-center justify-center rounded border border-gray-200 bg-white px-2.5 shadow-sm">
                                <div className="flex items-center">
                                    <span className="h-3 w-3 rounded-full bg-red-500 opacity-90"></span>
                                    <span className="-ml-1.5 h-3 w-3 rounded-full bg-amber-400 opacity-90"></span>
                                </div>
                            </div>
                            {/* PayPal */}
                            <div className="flex h-8 items-center justify-center rounded border border-gray-200 bg-white px-2.5 shadow-sm">
                                <span className="text-xs font-black italic text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
                            </div>
                            {/* Apple Pay */}
                            <div className="flex h-8 items-center justify-center rounded border border-gray-200 bg-white px-2.5 shadow-sm">
                                <span className="text-xs font-bold text-black">Pay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. Bottom Copyright Bar ── */}
            <div className="bg-[#ede8e1] px-4 py-3.5 text-xs text-gray-600 sm:px-8 lg:px-16">
                <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 sm:flex-row">
                    <p className="text-center font-medium sm:text-left">
                        © 2025 PAJJI STORE. All Rights Reserved.
                    </p>

                    {/* Currency Selector */}
                    <div className="flex cursor-pointer items-center gap-1 font-semibold text-gray-700 transition-colors hover:text-black">
                        <span>USD $</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;