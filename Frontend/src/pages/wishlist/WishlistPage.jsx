
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Heart,
    ShoppingCart,
    Trash2,
    LoaderCircle,
    ArrowLeft,
} from "lucide-react";

import {
    getWishlist,
    removeFromWishlist,
    moveWishlistToCart,
} from "../../services/wishlistService";


export default function WishlistPage() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);


    // Load wishlist when page opens
    const loadWishlist = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getWishlist();

            setItems(data.items || []);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (!localStorage.getItem("access")) {
            navigate("/login");
            return;
        }

        loadWishlist();

    }, [navigate]);


    // Remove a product from wishlist
    const handleRemove = async (productId) => {

        try {

            setProcessingId(productId);
            setError("");
            setMessage("");

            await removeFromWishlist(productId);

            setItems((previous) =>
                previous.filter(
                    (item) => item.product_id !== productId
                )
            );

            setMessage("Product removed from wishlist.");

        } catch (err) {

            setError(err.message);

        } finally {

            setProcessingId(null);

        }
    };


    // Move product from wishlist to cart
    const handleMoveToCart = async (productId) => {

        try {

            setProcessingId(productId);
            setError("");
            setMessage("");

            await moveWishlistToCart(productId);

            // Remove from wishlist UI
            setItems((previous) =>
                previous.filter(
                    (item) => item.product_id !== productId
                )
            );

            // Update Navbar cart counter
            window.dispatchEvent(new Event("cart-changed"));

            setMessage("Product moved to cart successfully.");

        } catch (err) {

            setError(err.message);

        } finally {

            setProcessingId(null);

        }
    };


    // Loading screen
    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center gap-3">

                <LoaderCircle
                    size={30}
                    className="animate-spin text-red-600"
                />

                <p className="font-medium text-gray-600">
                    Loading your wishlist...
                </p>

            </div>
        );
    }


    return (

        <main className="min-h-screen bg-[#f8f7f6] px-4 py-10">

            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <div className="mb-8 flex items-center gap-3">

                    <Heart
                        size={32}
                        className="fill-red-600 text-red-600"
                    />

                    <div>

                        <h1 className="text-3xl font-bold text-[#102342]">
                            My Wishlist
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Your favourite products in one place.
                        </p>

                    </div>

                </div>


                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </div>
                )}


                {/* Success message */}
                {message && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg bg-green-50 p-4 text-green-700"
                    >
                        {message}
                    </div>
                )}


                {/* Empty wishlist */}
                {items.length === 0 ? (

                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

                        <Heart
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-2xl font-bold text-gray-800">
                            Your wishlist is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Add products you love and find them here.
                        </p>

                        <Link
                            to="/product"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            <ArrowLeft size={18} />
                            Browse Products
                        </Link>

                    </div>

                ) : (

                    <>

                        <p className="mb-5 text-sm font-medium text-gray-500">
                            {items.length} favourite product(s)
                        </p>


                        {/* Wishlist product cards */}
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {items.map((item) => {

                                const originalPrice = Number(item.price || 0);

                                const discount = Number(
                                    item.discountPercentage || 0
                                );

                                const finalPrice = originalPrice * (
                                    1 - discount / 100
                                );

                                return (

                                    <article
                                        key={item.product_id}
                                        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                                    >

                                        {/* Product image */}
                                        <Link
                                            to={`/productdetails/${item.product_id}`}
                                        >

                                            <div className="flex h-56 items-center justify-center bg-gray-50 p-5">

                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="h-full w-full object-contain"
                                                />

                                            </div>

                                        </Link>


                                        {/* Product details */}
                                        <div className="p-5">

                                            <Link
                                                to={`/productdetails/${item.product_id}`}
                                            >

                                                <h2 className="line-clamp-2 min-h-12 font-bold text-[#102342] hover:text-red-600">
                                                    {item.title}
                                                </h2>

                                            </Link>


                                            {/* Price */}
                                            <div className="mt-3 flex items-center gap-2">

                                                <span className="text-xl font-bold text-red-600">
                                                    ${finalPrice.toFixed(2)}
                                                </span>

                                                {discount > 0 && (

                                                    <span className="text-sm text-gray-400 line-through">
                                                        ${originalPrice.toFixed(2)}
                                                    </span>

                                                )}

                                            </div>


                                            {/* Stock */}
                                            <p className={`mt-2 text-sm font-medium ${item.stock > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}>
                                                {item.stock > 0
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </p>


                                            {/* Buttons */}
                                            <div className="mt-5 flex gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveToCart(item.product_id)}
                                                    disabled={
                                                        processingId === item.product_id ||
                                                        item.stock <= 0
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                >

                                                    <ShoppingCart size={17} />

                                                    Move to Cart

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.product_id)}
                                                    disabled={processingId === item.product_id}
                                                    aria-label={`Remove ${item.title} from wishlist`}
                                                    className="rounded-lg border border-gray-200 p-3 text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                                                >

                                                    <Trash2 size={18} />

                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    </>

                )}

            </div>

        </main>

    );

}
