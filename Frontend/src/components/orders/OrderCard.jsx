
import {
    Package,
    CalendarDays,
    ShoppingBag,
} from "lucide-react";

export default function OrderCard({ order }) {

    // Format order date
    const orderDate = new Date(
        order.created_at
    ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Status badge colors
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">

            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-5">

                <div>
                    <div className="flex items-center gap-2 text-[#102342]">
                        <Package size={22} />

                        <h2 className="font-bold text-lg">
                            Order #{order.id}
                        </h2>
                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                        Reference: {order.order_number}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <CalendarDays size={16} />
                        {orderDate}
                    </div>
                </div>

                {/* Order Status */}
                <div>
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[order.status] ||
                            "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {order.status}
                    </span>
                </div>

            </div>

            {/* Ordered Products */}
            <div className="py-5 space-y-5">

                {order.items.map((item) => (

                    <div
                        key={item.id}
                        className="flex items-center gap-4"
                    >

                        <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                        />

                        <div className="flex-1">

                            <h3 className="font-semibold text-[#102342]">
                                {item.product_name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                                Unit price: ${Number(item.unit_price).toFixed(2)}
                            </p>

                        </div>

                        <p className="font-bold text-[#f97316]">
                            ${Number(item.line_total).toFixed(2)}
                        </p>

                    </div>

                ))}

            </div>

            {/* Order Summary */}
            <div className="border-t pt-5 space-y-2">

                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${Number(order.shipping_fee).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-[#102342] pt-2">
                    <span>Total</span>
                    <span className="text-[#f97316]">
                        ${Number(order.total_amount).toFixed(2)}
                    </span>
                </div>

            </div>

        </div>
    );
}
