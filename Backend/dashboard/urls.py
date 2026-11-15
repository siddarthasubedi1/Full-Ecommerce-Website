from django.urls import path

from .views import (
    DashboardSummaryView,
    AdminUserListView,
    AdminOrderListView,
    AdminOrderStatusView,
)

urlpatterns = [
    path("summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("users/", AdminUserListView.as_view(), name="dashboard-users"),
    path("orders/", AdminOrderListView.as_view(), name="dashboard-orders"),
    path(
        "orders/<int:pk>/status/",
        AdminOrderStatusView.as_view(),
        name="dashboard-order-status",
    ),
]
