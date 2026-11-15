
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
    Star,
    ShoppingCart,
    Truck,
    ShieldCheck,
    ArrowLeft,
    Plus,
    Minus,
    RefreshCw,
    Heart,
} from "lucide-react";

import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";

import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} from "../../services/wishlistService";


import ProductReviews from "./ProductReviews";


export default function ProductDetailed() {

    // Get product ID from the URL
    const { id } = useParams();

    const navigate = useNavigate();


    // Product states
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Image and quantity states
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Cart states
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState("");

    // Wishlist states
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [wishlistError, setWishlistError] = useState("");


    // --------------------------------------------------
    // STEP 1: FETCH PRODUCT DETAILS
    // --------------------------------------------------

    useEffect(() => {

        let isMounted = true;

        const fetchProductDetail = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getProductById(id);

                if (!isMounted) return;

                setProduct(data);

                // Select the first available product image
                const firstImage =
                    data.thumbnail ||
                    data.images?.[0] ||
                    "";

                setSelectedImage(firstImage);

                // Reset quantity when product changes
                setQuantity(1);

            } catch (err) {

                if (isMounted) {
                    setError(
                        err.message || "Failed to load product details."
                    );
                }

            } finally {

                if (isMounted) {
                    setLoading(false);
                }

            }

        };

        if (id) {
            fetchProductDetail();
        } else {
            setError("Product ID is missing.");
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };

    }, [id]);


    // --------------------------------------------------
    // STEP 2: CHECK WHETHER PRODUCT IS IN WISHLIST
    // --------------------------------------------------

    useEffect(() => {

        let isMounted = true;

        const checkWishlist = async () => {

            // User must be logged in
            if (!localStorage.getItem("access") || !product?.id) {

                setIsWishlisted(false);
                return;

            }

            try {

                const data = await getWishlist();

                if (!isMounted) return;

                // Support common wishlist response formats
                const wishlistItems = Array.isArray(data)
                    ? data
                    : data?.items || data?.wishlist || [];

                const exists = wishlistItems.some(
                    (item) =>
                        Number(item.product_id) === Number(product.id)
                );

                setIsWishlisted(exists);

            } catch (err) {

                console.error("Wishlist check failed:", err);

            }

        };

        if (product) {
            checkWishlist();
        }

        return () => {
            isMounted = false;
        };

    }, [product]);


    // --------------------------------------------------
    // STEP 3: INCREASE OR DECREASE PRODUCT QUANTITY
    // --------------------------------------------------

    const handleQuantityChange = (type) => {

        const availableStock = Number(product?.stock ?? 0);

        if (type === "dec" && quantity > 1) {

            setQuantity((previous) => previous - 1);

        } else if (
            type === "inc" &&
            quantity < Math.min(availableStock, 99)
        ) {

            setQuantity((previous) => previous + 1);

        }

    };


    // --------------------------------------------------
    // STEP 4: ADD OR REMOVE PRODUCT FROM WISHLIST
    // --------------------------------------------------

    const handleWishlistToggle = async () => {

        // Redirect to login if user is not authenticated
        if (!localStorage.getItem("access")) {

            navigate("/login");
            return;

        }

        try {

            setWishlistLoading(true);
            setWishlistError("");

            if (isWishlisted) {

                // Remove product from wishlist
                await removeFromWishlist(product.id);

                setIsWishlisted(false);

            } else {

                // Add product to wishlist
                await addToWishlist(product.id);

                setIsWishlisted(true);

            }

        } catch (err) {

            setWishlistError(
                err.message || "Failed to update wishlist."
            );

        } finally {

            setWishlistLoading(false);

        }

    };


    // --------------------------------------------------
    // STEP 5: ADD PRODUCT TO CART
    // --------------------------------------------------

    const handleAddToCart = async (redirectToCart = false) => {

        // Check login
        if (!localStorage.getItem("access")) {

            navigate("/login");
            return;

        }

        if (Number(product.stock) <= 0) {

            setCartError("This product is currently out of stock.");
            return;

        }

        try {

            setAddingToCart(true);
            setCartError("");

            // Add selected quantity to cart
            await addToCart(product.id, quantity);

            // Notify other components that cart has changed
            window.dispatchEvent(
                new Event("cart-changed")
            );

            // Navigate only after successful cart addition
            if (redirectToCart) {
                navigate("/cart");
            } else {
                navigate("/cart");
            }

        } catch (err) {

            setCartError(
                err.message || "Failed to add product to cart."
            );

        } finally {

            setAddingToCart(false);

        }

    };


    // --------------------------------------------------
    // STEP 6: LOADING SCREEN
    // --------------------------------------------------

    if (loading) {

        return (

            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">

                <RefreshCw
                    size={32}
                    className="animate-spin text-[#f97316]"
                />

                <p className="text-lg font-semibold text-[#102342]">
                    Fetching product details...
                </p>

            </div>

        );

    }


    // --------------------------------------------------
    // STEP 7: ERROR / PRODUCT NOT FOUND
    // --------------------------------------------------

    if (error || !product) {

        return (

            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">

                <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
                    <ArrowLeft size={32} />
                </div>

                <h2 className="text-2xl font-bold text-[#102342]">
                    Product Not Found
                </h2>

                <p className="mt-2 max-w-md text-sm text-gray-500">
                    {error ||
                        "We couldn't find the product you're looking for."}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/product")}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-[#f97316] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </button>

            </div>

        );

    }


    // --------------------------------------------------
    // STEP 8: PRODUCT PRICE AND IMAGE CALCULATIONS
    // --------------------------------------------------

    const discount = Number(product.discountPercentage ?? 0);

    const originalPrice = Number(product.price || 0);

    const discountedPrice =
        discount > 0
            ? originalPrice * (1 - discount / 100)
            : originalPrice;

    const imagesList = [
        ...new Set([
            product.thumbnail,
            ...(product.images || []),
        ].filter(Boolean)),
    ];

    const availableStock = Number(product.stock ?? 0);


    // --------------------------------------------------
    // STEP 9: PRODUCT DETAIL PAGE
    // --------------------------------------------------

    return (

        <div className="min-h-screen bg-[#f8f7f6] py-8 md:py-12">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


                {/* Navigation and Breadcrumb */}

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#f97316]"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="text-xs text-gray-400">

                        <Link to="/" className="hover:underline">
                            Home
                        </Link>

                        {" / "}

                        <Link to="/product" className="hover:underline">
                            Products
                        </Link>

                        {" / "}

                        <span className="capitalize text-gray-700">
                            {product.category?.replaceAll("-", " ")}
                        </span>

                    </div>

                </div>


                {/* Main Product Card */}

                <div className="grid grid-cols-1 gap-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2 lg:p-10">


                    {/* LEFT COLUMN: Product Images */}

                    <div className="flex flex-col gap-4">


                        {/* Main Product Image */}

                        <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#f9f8f6] p-6 sm:h-[420px]">

                            <img
                                src={
                                    selectedImage ||
                                    product.thumbnail ||
                                    ""
                                }
                                alt={product.title}
                                className="h-full w-full object-contain transition-all duration-300"
                            />


                            {/* Discount Badge */}

                            {discount > 0 && (

                                <span className="absolute left-3 top-3 rounded-full bg-[#f97316] px-3 py-1 text-xs font-bold text-white shadow">
                                    -{Math.round(discount)}% OFF
                                </span>

                            )}


                            {/* Wishlist Button */}

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                                aria-label={
                                    isWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                title={
                                    isWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                className={`absolute right-3 top-3 rounded-full p-2.5 shadow transition disabled:cursor-not-allowed disabled:opacity-50 ${isWishlisted
                                    ? "bg-red-50 text-red-500"
                                    : "bg-white text-gray-400 hover:text-red-500"
                                    }`}
                            >

                                {wishlistLoading ? (

                                    <RefreshCw
                                        size={20}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Heart
                                        size={20}
                                        className={
                                            isWishlisted
                                                ? "fill-red-500"
                                                : ""
                                        }
                                    />

                                )}

                            </button>

                        </div>


                        {/* Wishlist Error Message */}

                        {wishlistError && (

                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                            >
                                {wishlistError}
                            </p>

                        )}


                        {/* Thumbnail Images */}

                        {imagesList.length > 1 && (

                            <div className="flex gap-3 overflow-x-auto pb-2">

                                {imagesList.map((img, index) => (

                                    <button
                                        type="button"
                                        key={`${img}-${index}`}
                                        onClick={() => setSelectedImage(img)}
                                        aria-label={`View product image ${index + 1}`}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f9f8f6] p-1.5 transition ${selectedImage === img
                                            ? "border-[#f97316] ring-2 ring-orange-100"
                                            : "border-transparent hover:border-slate-300"
                                            }`}
                                    >

                                        <img
                                            src={img}
                                            alt={`${product.title} ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* RIGHT COLUMN: Product Information */}

                    <div className="flex flex-col justify-between">

                        <div>


                            {/* Category and Brand */}

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#f97316]">
                                    {product.category?.replaceAll("-", " ") ||
                                        "Uncategorized"}
                                </span>

                                {product.brand && (

                                    <span className="border-l border-slate-200 pl-2 text-xs font-semibold text-slate-400">
                                        Brand: {product.brand}
                                    </span>

                                )}

                            </div>


                            {/* Product Title */}

                            <h1 className="mt-3 text-2xl font-extrabold text-[#102342] sm:text-3xl">
                                {product.title}
                            </h1>


                            {/* Product Rating and Stock */}

                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">

                                <div className="flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50 px-2.5 py-1 font-bold text-amber-700">

                                    <Star
                                        size={16}
                                        className="fill-amber-400 text-amber-400"
                                    />

                                    <span>
                                        {product.rating ?? "N/A"}
                                    </span>

                                </div>

                                <span className="text-slate-200">
                                    |
                                </span>

                                <span
                                    className={`text-xs font-semibold ${availableStock > 0
                                        ? "text-emerald-600"
                                        : "text-rose-500"
                                        }`}
                                >
                                    {availableStock > 0
                                        ? `In Stock (${availableStock} left)`
                                        : "Out of Stock"}
                                </span>

                            </div>


                            {/* Product Price */}

                            <div className="mt-6 flex items-baseline gap-3">

                                <span className="text-3xl font-extrabold text-[#f97316]">
                                    ${discountedPrice.toFixed(2)}
                                </span>

                                {discount > 0 && (

                                    <span className="text-lg text-gray-400 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </span>

                                )}

                            </div>


                            {/* Product Description */}

                            <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                {product.description}
                            </p>


                            {/* Quantity Controls */}

                            <div className="mt-6 flex items-center gap-4">

                                <span className="text-sm font-semibold text-[#102342]">
                                    Quantity:
                                </span>

                                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange("dec")
                                        }
                                        disabled={quantity <= 1}
                                        aria-label="Decrease quantity"
                                        className="p-2.5 text-gray-600 transition hover:text-black disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="w-10 text-center font-bold text-[#102342]">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange("inc")
                                        }
                                        disabled={
                                            quantity >= Math.min(
                                                availableStock,
                                                99
                                            )
                                        }
                                        aria-label="Increase quantity"
                                        className="p-2.5 text-gray-600 transition hover:text-black disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* Cart Error */}

                        {cartError && (

                            <p
                                role="alert"
                                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                            >
                                {cartError}
                            </p>

                        )}


                        {/* Cart Buttons */}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <button
                                type="button"
                                onClick={() => handleAddToCart(false)}
                                disabled={
                                    addingToCart ||
                                    availableStock <= 0
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f97316] py-3.5 text-base font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {addingToCart ? (

                                    <RefreshCw
                                        size={20}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <ShoppingCart size={20} />

                                )}

                                {addingToCart
                                    ? "Adding..."
                                    : "Add to Cart"}

                            </button>


                            <button
                                type="button"
                                onClick={() => handleAddToCart(true)}
                                disabled={
                                    addingToCart ||
                                    availableStock <= 0
                                }
                                className="flex flex-1 items-center justify-center rounded-xl bg-[#102342] py-3.5 text-base font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Buy Now
                            </button>

                        </div>


                        {/* Extra Feature Badges */}

                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-xs font-medium text-gray-500">

                            <div className="flex items-center gap-2">

                                <Truck
                                    size={20}
                                    className="text-[#f97316]"
                                />

                                <span>
                                    Fast delivery nationwide
                                </span>

                            </div>

                            <div className="flex items-center gap-2">

                                <ShieldCheck
                                    size={20}
                                    className="text-[#f97316]"
                                />

                                <span>
                                    100% Authentic Product
                                </span>

                            </div>

                        </div>

                    </div>

                </div>




                {/* Customer reviews and ratings */}
                <ProductReviews productId={Number(id)} />


            </div>


        </div>

    );

}
