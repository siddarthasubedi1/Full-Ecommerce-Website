

// import { useEffect, useMemo, useState } from "react";
// import { getAllProducts } from "../../services/productService";
// import ProductFilter from "../../components/products/ProductFilter";

// const ProductPage = () => {
//     const [products, setProducts] = useState([]);
//     const [error, setError] = useState("");
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedBrands, setSelectedBrands] = useState([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);

//     // Fetch products from DummyJSON
//     useEffect(() => {
//         let cancelled = false;

//         const fetchProducts = async () => {
//             setLoading(true);
//             setError("");

//             try {
//                 // getAllProducts already returns the products array
//                 const data = await getAllProducts();

//                 if (!Array.isArray(data)) {
//                     throw new Error("Invalid product data received.");
//                 }

//                 if (!cancelled) {
//                     setProducts(data);
//                 }
//             } catch (err) {
//                 if (!cancelled) {
//                     setError(err.message || "Failed to load products.");
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setLoading(false);
//                 }
//             }
//         };

//         fetchProducts();

//         return () => {
//             cancelled = true;
//         };
//     }, []);

//     const handleCategoryChange = (category) => {
//         setSelectedCategories((prev) =>
//             prev.includes(category)
//                 ? prev.filter((item) => item !== category)
//                 : [...prev, category]
//         );
//     };

//     const handleBrandChange = (brand) => {
//         setSelectedBrands((prev) =>
//             prev.includes(brand)
//                 ? prev.filter((item) => item !== brand)
//                 : [...prev, brand]
//         );
//     };

//     // Filter the fetched products locally
//     const filteredProducts = useMemo(() => {
//         const searchTerm = search.trim().toLowerCase();

//         return products.filter((product) => {
//             const matchesCategory =
//                 selectedCategories.length === 0 ||
//                 selectedCategories.includes(product.category);

//             const matchesBrand =
//                 selectedBrands.length === 0 ||
//                 selectedBrands.includes(product.brand);

//             const matchesSearch = (product.title || "")
//                 .toLowerCase()
//                 .includes(searchTerm);

//             return matchesCategory && matchesBrand && matchesSearch;
//         });
//     }, [products, selectedCategories, selectedBrands, search]);

//     const clearFilters = () => {
//         setSelectedCategories([]);
//         setSelectedBrands([]);
//         setSearch("");
//     };

//     if (loading) {
//         return (
//             <div className="p-6 text-2xl font-bold">
//                 Loading products...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-6 text-red-600" role="alert">
//                 Error: {error}
//             </div>
//         );
//     }

//     return (
//         <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
//             {/* Filter Sidebar */}
//             <aside className="w-full shrink-0 border-r border-gray-200 bg-white p-6 shadow-sm md:w-72">
//                 <ProductFilter
//                     selectedCategories={selectedCategories}
//                     selectedBrands={selectedBrands}
//                     onCategoryChange={handleCategoryChange}
//                     onBrandChange={handleBrandChange}
//                 />

//                 {/* Search */}
//                 <div className="mt-5">
//                     <label
//                         htmlFor="product-search"
//                         className="mb-2 block text-sm font-semibold"
//                     >
//                         Search Products
//                     </label>

//                     <input
//                         id="product-search"
//                         type="text"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search products..."
//                         className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-green-700"
//                     />
//                 </div>

//                 <button
//                     type="button"
//                     onClick={clearFilters}
//                     className="mt-5 w-full rounded-md bg-[#1c3e2b] px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
//                 >
//                     Clear Filters
//                 </button>
//             </aside>

//             {/* Product Section */}
//             <main className="min-w-0 flex-1 p-6 md:p-8">
//                 <h1 className="mb-2 text-3xl font-bold text-gray-800">
//                     Our Products
//                 </h1>

//                 <p className="mb-8 text-gray-500">
//                     Showing {filteredProducts.length} of {products.length} products
//                 </p>

//                 {filteredProducts.length === 0 ? (
//                     <div className="rounded-xl bg-white p-8 text-center shadow-sm">
//                         <p className="text-gray-500">
//                             No products found matching your filters.
//                         </p>

//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="mt-4 rounded-md bg-[#1c3e2b] px-4 py-2 text-white"
//                         >
//                             Clear Filters
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                         {filteredProducts.map((item) => {
//                             const discount = item.discountPercentage ?? 0;
//                             const discountedPrice =
//                                 item.price * (1 - discount / 100);

//                             return (
//                                 <div
//                                     key={item.id}
//                                     className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
//                                 >
//                                     {/* Product Image */}
//                                     <img
//                                         src={item.thumbnail || item.images?.[0]}
//                                         alt={item.title}
//                                         loading="lazy"
//                                         className="h-48 w-full object-contain"
//                                     />

//                                     {/* Product Title */}
//                                     <h2 className="mt-4 text-lg font-semibold text-gray-800">
//                                         {item.title}
//                                     </h2>

//                                     {/* Category */}
//                                     <p className="mt-1 text-sm capitalize text-gray-500">
//                                         {item.category?.replaceAll("-", " ") ||
//                                             "Uncategorized"}
//                                     </p>

//                                     {/* Brand */}
//                                     <p className="text-sm text-gray-500">
//                                         Brand: {item.brand || "No brand"}
//                                     </p>

//                                     {/* Discounted Price */}
//                                     <p className="mt-2 text-xl font-bold text-blue-600">
//                                         ${discountedPrice.toFixed(2)}
//                                     </p>

//                                     {/* Original Price */}
//                                     {discount > 0 && (
//                                         <p className="text-sm text-gray-500">
//                                             <span className="line-through">
//                                                 ${Number(item.price).toFixed(2)}
//                                             </span>
//                                             <span className="ml-2 text-green-700">
//                                                 {discount}% off

//                                             </span>
//                                         </p>
//                                     )}

//                                     {/* Stock */}
//                                     <p className="mt-2 text-sm">
//                                         Stock: {item.stock ?? "N/A"}
//                                     </p>

//                                     {/* Rating */}
//                                     <p className="text-sm">
//                                         Rating: {item.rating ?? "N/A"} ⭐
//                                     </p>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default ProductPage;


import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductFilter from "../../components/products/ProductFilter";

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
                                    <h2 className="mt-4 text-lg font-bold text-[#102342]">{item.title}</h2>
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductPage;