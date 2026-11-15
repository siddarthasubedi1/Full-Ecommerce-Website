
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";

import { getOrderHistory } from "../services/orderService";
import OrderCard from "../components/orders/OrderCard";


export default function OrderHistoryPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch order history from Django
    useEffect(() => {

        let active = true;

        const fetchOrders = async () => {

            try {
                const data = await getOrderHistory();

                if (active) {
                    setOrders(data.orders || []);
                }

            } catch (err) {

                if (active) {
                    setError(err.message);
                }

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            active = false;
        };

    }, []);


    // Loading screen
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-lg text-gray-500">
                    Loading your orders...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#f8f7f6] py-12">

            <div className="max-w-6xl mx-auto px-4">

                {/* Page Heading */}
                <div className="flex items-center gap-3 mb-8">

                    <Package
                        size={32}
                        className="text-[#f97316]"
                    />

                    <div>
                        <h1 className="text-3xl font-bold text-[#102342]">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View your previous purchases.
                        </p>
                    </div>

                </div>


                {/* Error Message */}
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


                {/* Empty Order History */}
                {!error && orders.length === 0 && (

                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

                        <ShoppingBag
                            size={55}
                            className="mx-auto mb-5 text-gray-300"
                        />

                        <h2 className="text-xl font-bold text-[#102342]">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-2 mb-6">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/product"
                            className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
                        >
                            Start Shopping
                        </Link>

                    </div>
                )}


                {/* Display Orders */}
                {orders.length > 0 && (

                    <>
                        <p className="text-gray-600 mb-5">
                            You have placed {orders.length} order(s).
                        </p>

                        {orders.map((order) => (

                            <OrderCard
                                key={order.id}
                                order={order}
                            />

                        ))}
                    </>
                )}

            </div>

        </div>
    );
}
