import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import ProductFilter from "../../components/products/ProductFilter";


const ProductPage = () => {
    const navigate = useNavigate();

    // Product data
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Shopping cart states
    const [addingProductId, setAddingProductId] = useState(null);
    const [cartError, setCartError] = useState("");


    // ==========================================
    // FETCH PRODUCTS FROM DJANGO BACKEND
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const filters = {};

                if (search.trim()) {
                    filters.search = search.trim();
                }

                if (selectedCategories.length > 0) {
                    filters.category = selectedCategories.join(",");
                }

                if (selectedBrands.length > 0) {
                    filters.brand = selectedBrands.join(",");
                }

                if (minPrice !== "") {
                    filters.min_price = minPrice;
                }

                if (maxPrice !== "") {
                    filters.max_price = maxPrice;
                }

                const data = await getAllProducts(filters);

                if (!cancelled) {
                    setProducts(
                        Array.isArray(data)
                            ? data
                            : Array.isArray(data?.products)
                                ? data.products
                                : Array.isArray(data?.results)
                                    ? data.results
                                    : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Failed to fetch products."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const timer = setTimeout(fetchProducts, 400);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [
        selectedCategories,
        selectedBrands,
        search,
        minPrice,
        maxPrice,
    ]);


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };


    // ==========================================
    // BRAND FILTER
    // ==========================================

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand)
                ? prev.filter((b) => b !== brand)
                : [...prev, brand]
        );
    };


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
    };


    // ==========================================
    // ADD TO CART USING DJANGO API
    // ==========================================

    const handleAddToCart = async (product) => {
        // Prevent concurrent requests
        if (addingProductId !== null) {
            return;
        }

        // Check product availability
        if (
            !product?.id ||
            (product.stock ?? 0) <= 0
        ) {
            setCartError("This product is unavailable.");
            return;
        }

        // Check user authentication
        const accessToken = localStorage.getItem("access");

        if (!accessToken) {
            navigate("/login", {
                state: {
                    from: "/product",
                },
            });
            return;
        }

        setAddingProductId(product.id);
        setCartError("");

        try {
            // Send product ID and quantity to Django
            await addToCart(product.id, 1);

            // Notify Navbar to update cart counter
            window.dispatchEvent(
                new Event("cart-changed")
            );

            // Navigate only after successful backend response
            navigate("/cart");

        } catch (err) {
            console.error("Add to cart failed:", err);

            setCartError(
                err.message ||
                "Unable to add product. Please try again."
            );
        } finally {
            setAddingProductId(null);
        }
    };


    // ==========================================
    // MAIN COMPONENT
    // ==========================================

    return (
        <div className="flex min-h-screen flex-col bg-[#f8f7f6] md:flex-row">

            {/* SIDEBAR */}
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

                {/* SEARCH */}
                <div className="mt-5">
                    <label
                        htmlFor="product-search"
                        className="mb-2 block text-sm font-semibold"
                    >
                        Search
                    </label>

                    <input
                        id="product-search"
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-red-500"
                    />
                </div>

                {/* CLEAR FILTER BUTTON */}
                <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    Clear Filters
                </button>
            </aside>


            {/* PRODUCTS SECTION */}
            <main className="min-w-0 flex-1 p-6 md:p-10">

                <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#102342] md:text-4xl">
                    Our Products
                </h1>

                <p className="mb-8 text-gray-500">
                    {loading
                        ? "Loading..."
                        : `Showing ${products.length} products`}
                </p>


                {/* PRODUCT FETCH ERROR */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </div>
                )}


                {/* CART ERROR */}
                {cartError && (
                    <div
                        role="alert"
                        className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                        <span>{cartError}</span>

                        <button
                            type="button"
                            onClick={() => setCartError("")}
                            className="font-bold"
                            aria-label="Dismiss error"
                        >
                            ✕
                        </button>
                    </div>
                )}


                {/* LOADING PRODUCTS */}
                {loading ? (
                    <p className="text-gray-400">
                        Fetching products...
                    </p>

                ) : error ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            Could not load products.
                        </p>
                    </div>

                ) : products.length === 0 ? (
                    <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">

                        <p className="text-gray-500">
                            No products found.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 rounded-md bg-red-600 px-5 py-3 text-white hover:bg-red-700"
                        >
                            Clear Filters
                        </button>
                    </div>

                ) : (

                    /* PRODUCT GRID */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                        {products.map((item) => {
                            const discount =
                                Number(item.discountPercentage ?? 0);

                            const originalPrice =
                                Number(item.price ?? 0);

                            const discountedPrice =
                                originalPrice *
                                (1 - discount / 100);

                            const stock = Number(item.stock ?? 0);

                            const outOfStock = stock <= 0;

                            const isAdding =
                                addingProductId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* PRODUCT IMAGE */}
                                    <img
                                        src={
                                            item.thumbnail ||
                                            item.images?.[0]
                                        }
                                        alt={item.title}
                                        loading="lazy"
                                        className="h-52 w-full rounded-lg bg-[#f8f7f5] object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                                    />


                                    {/* PRODUCT TITLE */}
                                    <h2 className="mt-4 text-lg font-bold text-[#102342]">
                                        {item.title}
                                    </h2>


                                    {/* CATEGORY */}
                                    <p className="mt-1 text-sm capitalize text-gray-500">
                                        {item.category?.replaceAll("-", " ")}
                                    </p>


                                    {/* BRAND */}
                                    <p className="text-sm text-gray-500">
                                        Brand: {item.brand || "N/A"}
                                    </p>


                                    {/* DISCOUNTED PRICE */}
                                    <p className="mt-3 text-2xl font-extrabold text-[#f97316]">
                                        ${discountedPrice.toFixed(2)}
                                    </p>


                                    {/* ORIGINAL PRICE */}
                                    {discount > 0 && (
                                        <p className="text-sm text-gray-500">

                                            <span className="line-through">
                                                ${originalPrice.toFixed(2)}
                                            </span>

                                            <span className="ml-2 font-medium text-green-700">
                                                {discount}% off
                                            </span>
                                        </p>
                                    )}


                                    {/* STOCK */}
                                    <p className="mt-2 text-sm">
                                        Stock: {stock}
                                    </p>


                                    {/* RATING */}
                                    <p className="text-sm">
                                        Rating: {item.rating ?? "N/A"} ⭐
                                    </p>


                                    {/* ADD TO CART BUTTON */}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddToCart(item)
                                            }
                                            disabled={
                                                addingProductId !== null ||
                                                outOfStock
                                            }
                                            className="block w-full rounded-2xl border-2 bg-orange-400 py-3 text-center text-lg font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isAdding
                                                ? "Adding..."
                                                : outOfStock
                                                    ? "Out of Stock"
                                                    : "Add to Cart"}
                                        </button>
                                    </div>

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
