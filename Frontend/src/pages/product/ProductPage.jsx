
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductFilter from "../../components/products/ProductFilter";
import { Link } from "react-router-dom";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // All filtering done by Django backend
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const filters = {};
                if (search.trim()) filters.search = search.trim();
                if (selectedCategories.length) filters.category = selectedCategories.join(",");
                if (selectedBrands.length) filters.brand = selectedBrands.join(",");
                if (minPrice) filters.min_price = minPrice;
                if (maxPrice) filters.max_price = maxPrice;

                const data = await getAllProducts(filters);
                if (!cancelled) setProducts(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 400);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [selectedCategories, selectedBrands, search, minPrice, maxPrice]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
    };



    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7f6] md:flex-row">

            {/* Sidebar */}
            <aside className="w-full shrink-0 border-r border-slate-200 bg-white p-6 shadow-sm md:w-72 lg:p-8">
                <ProductFilter
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onCategoryChange={handleCategoryChange}
                    onBrandChange={handleBrandChange}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                />

                <div className="mt-5">
                    <label htmlFor="product-search" className="mb-2 block text-sm font-semibold">Search</label>
                    <input
                        id="product-search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-red-500"
                    />
                </div>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    Clear Filters
                </button>
            </aside>

            {/* Products */}
            <main className="min-w-0 flex-1 p-6 md:p-10">
                <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#102342] md:text-4xl">Our Products</h1>
                <p className="mb-8 text-gray-500">
                    {loading ? "Loading..." : `Showing ${products.length} products`}
                </p>

                {loading ? (
                    <p className="text-gray-400">Fetching products...</p>
                ) : products.length === 0 ? (
                    <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">No products found.</p>
                        <button type="button" onClick={clearFilters} className="mt-4 rounded-md bg-red-600 px-5 py-3 text-white hover:bg-red-700">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((item) => {
                            const discount = item.discountPercentage ?? 0;
                            const discountedPrice = item.price * (1 - discount / 100);

                            return (

                                <div key={item.id} className="group overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <img src={item.thumbnail || item.images?.[0]} alt={item.title} loading="lazy" className="h-52 w-full rounded-lg bg-[#f8f7f5] object-contain p-3 transition duration-300 group-hover:scale-[1.03]" />
                                    <h2 className="mt-4 text-lg font-bold text-[#102342]">{item.title} </h2>
                                    <p className="mt-1 text-sm capitalize text-gray-500">{item.category?.replaceAll("-", " ")}</p>
                                    <p className="text-sm text-gray-500">Brand: {item.brand || "N/A"}</p>
                                    <p className="mt-3 text-2xl font-extrabold text-[#f97316]">${discountedPrice.toFixed(2)}</p>
                                    {discount > 0 && (
                                        <p className="text-sm text-gray-500">
                                            <span className="line-through">${Number(item.price).toFixed(2)}</span>
                                            <span className="ml-2 font-medium text-green-700">{discount}% off</span>
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm">Stock: {item.stock ?? "N/A"}</p>
                                    <p className="text-sm">Rating: {item.rating ?? "N/A"} ⭐</p>

                                    <div >
                                        <Link
                                            to="/cart"
                                            className="mt-4 block w-full rounded-2xl border-2 bg-orange-400 py-3 text-center text-lg font-bold text-white transition hover:bg-amber-600"
                                        >
                                            Add to cart
                                        </Link>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )
                }
            </main >
        </div >
    );
};

export default ProductPage;