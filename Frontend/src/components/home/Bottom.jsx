

import { Link } from "react-router-dom";

export default function Bottom() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-[#0b1e3b] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Summer Sale is Live!</h2>
                    <p className="text-gray-300 mb-4">Up to 60% off on selected items. Don't miss out.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-[#f97316] px-6 py-2.5 rounded font-semibold hover:bg-orange-600 transition"
                    >
                        Grab the Deal
                    </Link>
                </div>
                <div className="flex gap-8 text-center">
                    {[
                        { num: "10K+", label: "Products" },
                        { num: "50K+", label: "Customers" },
                        { num: "99%", label: "Satisfaction" },
                    ].map((s, i) => (
                        <div key={i}>
                            <p className="text-2xl font-bold text-[#f97316]">{s.num}</p>
                            <p className="text-xs text-gray-300">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}