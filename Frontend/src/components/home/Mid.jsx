
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { getCategories } from "../../services/productService";
import Bestseller from "./Bestseller";

export default function Mid() {
    const { data: categories } = useFetch(() => getCategories(), []);

    return (
        <>
            {categories?.length > 0 && (
                <section className="max-w-7xl mx-auto px-5 py-16">
                    <h2 className="text-3xl font-extrabold text-[#102342] mb-8">Shop by Category</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/product?category=${cat.name}`}
                                className="min-w-[165px] shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm p-7 text-center hover:-translate-y-1 hover:border-[#f97316] hover:shadow-md transition"
                            >
                                <p className="font-semibold text-[#0b1e3b] capitalize">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            <Bestseller />
        </>
    );
}