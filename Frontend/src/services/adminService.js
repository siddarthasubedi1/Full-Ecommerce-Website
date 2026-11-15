
import { API_BASE_URL } from "./apiConfig";


// Common function for administrator API requests
async function adminRequest(url, options = {}) {

    const token = localStorage.getItem("access");

    if (!token) {
        throw new Error("Please login as an administrator.");
    }

    let response;

    try {

        response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

    } catch {

        throw new Error("Cannot connect to the backend.");

    }

    if (response.status === 204) {
        return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {

        const message =
            data.detail ||
            data.message ||
            data.error ||
            JSON.stringify(data);

        throw new Error(message);

    }

    return data;
}


// Dashboard statistics
export const getDashboardSummary = () =>
    adminRequest("/dashboard/summary/");


// Registered users
export const getAdminUsers = () =>
    adminRequest("/dashboard/users/");


// All orders
export const getAdminOrders = () =>
    adminRequest("/dashboard/orders/");


// Update order status
export const updateOrderStatus = (orderId, status) =>
    adminRequest(`/dashboard/orders/${orderId}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });


// Product management
export const getAdminProducts = () =>
    adminRequest("/product/");

export const createProduct = (product) =>
    adminRequest("/product/", {
        method: "POST",
        body: JSON.stringify(product),
    });

export const updateProduct = (id, product) =>
    adminRequest(`/product/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(product),
    });

export const deleteProduct = (id) =>
    adminRequest(`/product/${id}/`, {
        method: "DELETE",
    });


// Category management
export const getAdminCategories = () =>
    adminRequest("/product/categories/");

export const createCategory = (category) =>
    adminRequest("/product/categories/", {
        method: "POST",
        body: JSON.stringify(category),
    });

export const updateCategory = (id, category) =>
    adminRequest(`/product/categories/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(category),
    });

export const deleteCategory = (id) =>
    adminRequest(`/product/categories/${id}/`, {
        method: "DELETE",
    });


// Brand management
export const getAdminBrands = () =>
    adminRequest("/product/brands/");

export const createBrand = (brand) =>
    adminRequest("/product/brands/", {
        method: "POST",
        body: JSON.stringify(brand),
    });

export const updateBrand = (id, brand) =>
    adminRequest(`/product/brands/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(brand),
    });

export const deleteBrand = (id) =>
    adminRequest(`/product/brands/${id}/`, {
        method: "DELETE",
    });
