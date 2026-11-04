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
    Heart
} from "lucide-react";
import { getProductById } from "../../services/productService";

export default function ProductDetailed() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProductById(id);

                if (isMounted) {
                    setProduct(data);
                    // Set default image: thumbnail or first image in list
                    setSelectedImage(data.thumbnail || data.images?.[0] || "");
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to load product details.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (id) fetchProductDetail();

        return () => { isMounted = false; };
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === "dec" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        } else if (type === "inc" && quantity < (product?.stock || 10)) {
            setQuantity((prev) => prev + 1);
        }
    };

    // ── LOADING STATE ──────────────────────────────
    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <RefreshCw size={32} className="animate-spin text-[#f97316]" />
                <p className="text-[#102342] font-semibold text-lg">Fetching product details...</p>
            </div>
        );
    }

    // ── ERROR / NOT FOUND STATE ────────────────────
    if (error || !product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-red-100 p-4 text-red-600 mb-4">
                    <ArrowLeft size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[#102342]">Product Not Found</h2>
                <p className="mt-2 text-sm text-gray-500 max-w-md">
                    {error || "We couldn't find the product you're looking for."}
                </p>
                <button
                    onClick={() => navigate("/product")}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-[#f97316] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600"
                >
                    <ArrowLeft size={18} /> Back to Products
                </button>
            </div>
        );
    }

    // Calculations
    const discount = product.discountPercentage ?? 0;
    const originalPrice = Number(product.price || 0);
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    const imagesList = product.images?.length ? product.images : [product.thumbnail];

    return (
        <div className="min-h-screen bg-[#f8f7f6] py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Navigation Breadcrumb / Back Link */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#f97316]"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="text-xs text-gray-400">
                        <Link to="/" className="hover:underline">Home</Link> /{" "}
                        <Link to="/product" className="hover:underline">Products</Link> /{" "}
                        <span className="text-gray-700 capitalize">{product.category}</span>
                    </div>
                </div>

                {/* Main Product Card */}
                <div className="grid grid-cols-1 gap-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2 lg:p-10">

                    {/* LEFT COLUMN: Gallery */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative h-[350px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-[#f9f8f6] p-6 flex items-center justify-center border border-slate-100">
                            <img
                                src={selectedImage || product.thumbnail}
                                alt={product.title}
                                className="h-full w-full object-contain transition-all duration-300"
                            />
                            {discount > 0 && (
                                <span className="absolute top-3 left-3 rounded-full bg-[#f97316] px-3 py-1 text-xs font-bold text-white shadow">
                                    -{Math.round(discount)}% OFF
                                </span>
                            )}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`absolute top-3 right-3 rounded-full p-2.5 shadow transition ${isWishlisted ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500"
                                    }`}
                            >
                                <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} />
                            </button>
                        </div>

                        {/* Thumbnail Carousel */}
                        {imagesList.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {imagesList.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f9f8f6] p-1.5 transition ${selectedImage === img
                                            ? "border-[#f97316] ring-2 ring-orange-100"
                                            : "border-transparent hover:border-slate-300"
                                            }`}
                                    >
                                        <img src={img} alt="" className="h-full w-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Info & Actions */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Category & Brand Badges */}
                            <div className="flex items-center gap-2">
                                <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#f97316]">
                                    {product.category?.replaceAll("-", " ")}
                                </span>
                                {product.brand && (
                                    <span className="text-xs font-semibold text-slate-400 border-l border-slate-200 pl-2">
                                        Brand: {product.brand}
                                    </span>
                                )}
                            </div>

                            {/* Product Title */}
                            <h1 className="mt-3 text-2xl font-extrabold text-[#102342] sm:text-3xl">
                                {product.title}
                            </h1>

                            {/* Rating & Stock Status */}
                            <div className="mt-3 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-700 font-bold border border-amber-200/60">
                                    <Star size={16} className="fill-amber-400 text-amber-400" />
                                    <span>{product.rating ?? "N/A"}</span>
                                </div>
                                <span className="text-slate-200">|</span>
                                <span className={`font-semibold text-xs ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                                </span>
                            </div>

                            {/* Pricing */}
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

                            {/* Description */}
                            <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                {product.description}
                            </p>

                            {/* Quantity Controls */}
                            <div className="mt-6 flex items-center gap-4">
                                <span className="text-sm font-semibold text-[#102342]">Quantity:</span>
                                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                                    <button
                                        onClick={() => handleQuantityChange("dec")}
                                        disabled={quantity <= 1}
                                        className="p-2.5 text-gray-600 transition hover:text-black disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center font-bold text-[#102342]">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("inc")}
                                        disabled={quantity >= (product.stock || 10)}
                                        className="p-2.5 text-gray-600 transition hover:text-black disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => navigate("/cart")}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f97316] py-3.5 text-base font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <Link
                                to="/cart"
                                className="flex flex-1 items-center justify-center rounded-xl bg-[#102342] py-3.5 text-base font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98]"
                            >
                                Buy Now
                            </Link>
                        </div>

                        {/* Extra Feature Badges */}
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-xs font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <Truck size={20} className="text-[#f97316]" />
                                <span>Fast delivery nationwide</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={20} className="text-[#f97316]" />
                                <span>100% Authentic Product</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}