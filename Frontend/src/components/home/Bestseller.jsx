import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { getAllProducts } from "../../services/productService";

export default function Bestseller() {
    const { data: products, loading } = useFetch(() => getAllProducts(), []);

    if (loading) return <p className="text-center py-8 text-gray-400">Loading...</p>;
    if (!products?.length) return null;

    const top = products.slice(0, 15);

    return (
        <section className="bg-[#f7f3ef] py-16">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-[#102342] mb-8">Bestsellers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {top.map((p) => (
                        <Link
                            key={p.id}
                            to={`/productdetails/${p.id}`}
                            className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition duration-300 group"
                        >
                            <div className="relative">
                                <img
                                    src={p.thumbnail}
                                    alt={p.title}
                                    className="w-full h-44 object-contain bg-[#f9f8f6] p-3 group-hover:scale-105 transition"
                                />
                                {p.discountPercentage > 10 && (
                                    <span className="absolute top-2 left-2 bg-[#f97316] text-white text-xs px-2 py-0.5 rounded-full">
                                        -{Math.round(p.discountPercentage)}%
                                    </span>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                                <p className="font-semibold text-[#0b1e3b] text-sm truncate">{p.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">{p.rating}</span>
                                </div>
                                <p className="text-[#f97316] text-lg font-bold mt-2">${p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}