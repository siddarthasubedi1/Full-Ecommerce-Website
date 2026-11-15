from django.db.models import Sum
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import ValidationError

from account.models import User
from product_app.models import Product, Category, Brand
from orders.models import Order
from orders.serializers import OrderSerializer


# All dashboard APIs require an administrator
class AdminDashboardPermission(APIView):

    permission_classes = [IsAdminUser]


# Dashboard statistics
class DashboardSummaryView(AdminDashboardPermission):

    def get(self, request):

        # Count registered customers
        total_users = User.objects.filter(is_admin=False).count()

        # Product statistics
        total_products = Product.objects.count()

        active_products = Product.objects.filter(is_active=True).count()

        # Category and brand statistics
        total_categories = Category.objects.count()
        total_brands = Brand.objects.count()

        # Order statistics
        total_orders = Order.objects.count()

        pending_orders = Order.objects.filter(status="pending").count()

        # This is order value, not verified payment revenue.
        order_value = (
            Order.objects.exclude(status="cancelled").aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        # Inventory statistics
        inventory_units = (
            Product.objects.filter(is_active=True).aggregate(total=Sum("stock"))[
                "total"
            ]
            or 0
        )

        low_stock_products = Product.objects.filter(
            is_active=True, stock__lte=5
        ).count()

        return Response(
            {
                "total_users": total_users,
                "total_products": total_products,
                "active_products": active_products,
                "total_categories": total_categories,
                "total_brands": total_brands,
                "total_orders": total_orders,
                "pending_orders": pending_orders,
                "order_value": order_value,
                "inventory_units": inventory_units,
                "low_stock_products": low_stock_products,
            }
        )


# View registered customers
class AdminUserListView(AdminDashboardPermission):

    def get(self, request):

        users = User.objects.filter(is_admin=False).order_by("-created_at")

        data = []

        for user in users:

            data.append(
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "is_active": user.is_active,
                    "created_at": user.created_at,
                }
            )

        return Response(
            {
                "total_users": len(data),
                "users": data,
            }
        )


# View all orders
class AdminOrderListView(AdminDashboardPermission):

    def get(self, request):

        orders = (
            Order.objects.select_related("user")
            .prefetch_related("items")
            .order_by("-created_at")
        )

        data = []

        for order in orders:

            order_data = OrderSerializer(order).data

            order_data["customer_name"] = order.user.name
            order_data["customer_email"] = order.user.email

            data.append(order_data)

        return Response(
            {
                "total_orders": len(data),
                "orders": data,
            }
        )


# Update order status
class AdminOrderStatusView(AdminDashboardPermission):

    def patch(self, request, pk):

        order = get_object_or_404(Order, pk=pk)

        new_status = request.data.get("status")

        valid_statuses = [choice[0] for choice in Order.ORDER_STATUS]

        if new_status not in valid_statuses:

            raise ValidationError(
                {
                    "status": (
                        "Invalid status. Choose pending, confirmed, "
                        "shipped, delivered or cancelled."
                    )
                }
            )

        order.status = new_status
        order.save(update_fields=["status", "updated_at"])

        return Response(
            {
                "message": "Order status updated successfully.",
                "order_id": order.id,
                "status": order.status,
            }
        )
