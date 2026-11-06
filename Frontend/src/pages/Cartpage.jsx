
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ShoppingCart,
    Minus,
    Plus,
    Trash2,
} from "lucide-react";

import {
    getCart,
    updateCartQuantity,
    removeFromCart,
} from "../services/cartService";


export default function Cartpage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    // Fetch cart from the Django backend
    const fetchCart = async () => {
        const data = await getCart();
        setCart(data);
    };

    useEffect(() => {
        let active = true;

        getCart()
            .then((data) => {
                if (active) setCart(data);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // Increase or decrease quantity
    const handleQuantityChange = async (
        productId,
        newQuantity
    ) => {
        if (newQuantity < 1 || newQuantity > 99) {
            return;
        }

        setUpdating(true);
        setError("");

        try {
            await updateCartQuantity(productId, newQuantity);
            await fetchCart();
            window.dispatchEvent(new Event("cart-changed"));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Remove product
    const handleRemove = async (productId) => {
        setUpdating(true);
        setError("");

        try {
            await removeFromCart(productId);
            await fetchCart();
            window.dispatchEvent(new Event("cart-changed"));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p>Loading your cart...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f6] py-12">
            <div className="mx-auto max-w-6xl px-4">

                <div className="flex items-center gap-3 mb-8">
                    <ShoppingCart
                        size={30}
                        className="text-[#f97316]"
                    />
                    <h1 className="text-3xl font-bold text-[#102342]">
                        Your Shopping Cart
                    </h1>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="bg-red-100 text-red-700 p-4 rounded-lg mb-6"
                    >
                        {error}

                        {!localStorage.getItem("access") && (
                            <Link
                                to="/login"
                                className="ml-2 font-semibold underline"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}

                {cart && cart.items.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <ShoppingCart
                            size={50}
                            className="mx-auto mb-4 text-gray-300"
                        />

                        <p className="text-gray-500 mb-6">
                            Your cart is empty.
                        </p>

                        <Link
                            to="/product"
                            className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {cart && cart.items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Cart Products */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-28 h-28 object-contain bg-gray-50 rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <Link
                                            to={`/productdetails/${item.product_id}`}
                                            className="text-lg font-bold text-[#102342] hover:text-[#f97316]"
                                        >
                                            {item.name}
                                        </Link>

                                        <p className="text-[#f97316] font-bold mt-2">
                                            ${Number(item.price).toFixed(2)}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 mt-4">

                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    disabled={
                                                        updating ||
                                                        item.quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product_id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="p-2 disabled:opacity-30"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="px-3 font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    disabled={
                                                        updating ||
                                                        item.quantity >= item.stock ||
                                                        item.quantity >= 99
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product_id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="p-2 disabled:opacity-30"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                disabled={updating}
                                                onClick={() =>
                                                    handleRemove(item.product_id)
                                                }
                                                className="flex items-center gap-2 text-red-600 text-sm font-semibold disabled:opacity-30"
                                            >
                                                <Trash2 size={16} />
                                                Remove
                                            </button>

                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="font-bold text-lg text-[#102342]">
                                            ${Number(item.total).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#102342] mb-6">
                                Order Summary
                            </h2>

                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">
                                    Total Items
                                </span>

                                <span className="font-semibold">
                                    {cart.total_quantity}
                                </span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">
                                    Subtotal
                                </span>

                                <span className="font-semibold">
                                    ${Number(cart.subtotal).toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t pt-5 mt-5 flex justify-between">
                                <span className="font-bold text-lg">
                                    Total before shipping and tax
                                </span>

                                <span className="font-bold text-xl text-[#f97316]">
                                    ${Number(cart.subtotal).toFixed(2)}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mt-3">
                                Shipping, tax and checkout are not implemented yet.
                            </p>

                            <button
                                disabled
                                className="w-full bg-[#102342] text-white py-3 rounded-xl font-semibold mt-6 opacity-50 cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/product"
                                className="block text-center text-[#f97316] font-semibold mt-4 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
