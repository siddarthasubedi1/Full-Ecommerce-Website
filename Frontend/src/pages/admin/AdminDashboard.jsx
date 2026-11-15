
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Package,
    Users,
    ShoppingBag,
    Tags,
    TrendingUp,
    Warehouse,
    RefreshCw,
} from "lucide-react";

import {
    getDashboardSummary,
    getAdminUsers,
    getAdminOrders,
    updateOrderStatus,
    getAdminProducts,
    getAdminCategories,
    getAdminBrands,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    deleteCategory,
    createBrand,
    deleteBrand,
} from "../../services/adminService";

// Convert different API response formats into arrays.
// Supports: [], { results: [] }, { users: [] }, etc.
const getArray = (response, key) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.[key])) return data[key];

    return [];
};

// Extract a readable error message from Axios/Django errors.
const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") return data;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;

    if (data && typeof data === "object") {
        return Object.entries(data)
            .map(([field, messages]) => {
                const value = Array.isArray(messages)
                    ? messages.join(", ")
                    : String(messages);

                return `${field}: ${value} `;
            })
            .join(" | ");
    }

    return error?.message || "Something went wrong. Please try again.";
};

// Initial product form values.
// These fields should match your Django Product model.
const emptyProduct = {
    name: "",
    sku: "",
    description: "",
    price: "",
    discount_percent: 0,
    stock: 0,
    is_available: true,
    category: "",
    brand: "",
};

export default function AdminDashboard() {
    const navigate = useNavigate();

    // Active dashboard section.
    const [activeTab, setActiveTab] = useState("overview");

    // Dashboard data.
    const [summary, setSummary] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Loading and messages.
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Product form.
    const [editingProductId, setEditingProductId] = useState(null);
    const [productForm, setProductForm] = useState({ ...emptyProduct });

    // Category and brand forms.
    const [categoryName, setCategoryName] = useState("");
    const [brandName, setBrandName] = useState("");

    // Load all dashboard information.
    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                summaryData,
                userData,
                orderData,
                productData,
                categoryData,
                brandData,
            ] = await Promise.all([
                getDashboardSummary(),
                getAdminUsers(),
                getAdminOrders(),
                getAdminProducts(),
                getAdminCategories(),
                getAdminBrands(),
            ]);

            const summaryResult = summaryData?.data ?? summaryData;

            setSummary(summaryResult);
            setUsers(getArray(userData, "users"));
            setOrders(getArray(orderData, "orders"));
            setProducts(getArray(productData, "products"));
            setCategories(getArray(categoryData, "categories"));
            setBrands(getArray(brandData, "brands"));
        } catch (err) {
            const status = err?.response?.status;

            setError(getErrorMessage(err));

            // Redirect only when the server says the token is invalid.
            if (status === 401) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // Check login and load dashboard when the page opens.
    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();
    }, [navigate]);

    // Update product form values.
    const handleProductInput = (event) => {
        const { name, value } = event.target;

        setProductForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Create or update a product.
    const handleProductSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const payload = {
                ...productForm,
                price: Number(productForm.price),
                discount_percent: Number(productForm.discount_percent),
                stock: Number(productForm.stock),
                category: Number(productForm.category),
                brand: productForm.brand
                    ? Number(productForm.brand)
                    : null,
            };

            if (editingProductId !== null) {
                await updateProduct(editingProductId, payload);
                setMessage("Product updated successfully.");
            } else {
                await createProduct(payload);
                setMessage("Product created successfully.");
            }

            setProductForm({ ...emptyProduct });
            setEditingProductId(null);

            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    // Load a product into the form for editing.
    const handleEditProduct = (product) => {
        setEditingProductId(product.id);

        setProductForm({
            name: product.name ?? "",
            sku: product.sku ?? "",
            description: product.description ?? "",
            price: product.price ?? "",
            discount_percent: product.discount_percent ?? 0,
            stock: product.stock ?? 0,
            is_available: product.is_available ?? true,
            category:
                typeof product.category === "object"
                    ? product.category?.id ?? ""
                    : product.category ?? "",
            brand:
                typeof product.brand === "object"
                    ? product.brand?.id ?? ""
                    : product.brand ?? "",
        });

        setActiveTab("products");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancel product editing.
    const cancelProductEdit = () => {
        setEditingProductId(null);
        setProductForm({ ...emptyProduct });
    };

    // Delete a product.
    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteProduct(id);

            setMessage("Product deleted successfully.");
            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Create a category.
    const handleCreateCategory = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            await createCategory({ name: categoryName.trim() });

            setCategoryName("");
            setMessage("Category created successfully.");

            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Delete a category.
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            setError("");
            await deleteCategory(id);
            setMessage("Category deleted successfully.");

            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Create a brand.
    const handleCreateBrand = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            await createBrand({ name: brandName.trim() });

            setBrandName("");
            setMessage("Brand created successfully.");

            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Delete a brand.
    const handleDeleteBrand = async (id) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) {
            return;
        }

        try {
            setError("");
            await deleteBrand(id);
            setMessage("Brand deleted successfully.");

            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Change an order's status.
    const handleOrderStatus = async (orderId, status) => {
        try {
            setError("");
            setMessage("");

            await updateOrderStatus(orderId, status);

            setMessage("Order status updated successfully.");
            await loadDashboard();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Reusable statistics card.
    const StatCard = ({ title, value, icon: Icon }) => (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#102342]">
                        {value ?? 0}
                    </h2>
                </div>

                <div className="rounded-lg bg-red-50 p-3 text-red-600">
                    <Icon size={25} />
                </div>
            </div>
        </div>
    );

    // Dashboard navigation tabs.
    const tabs = [
        ["overview", "Overview"],
        ["products", "Products"],
        ["categories", "Categories"],
        ["brands", "Brands"],
        ["users", "Customers"],
        ["orders", "Orders"],
    ];

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center gap-3">
                <RefreshCw className="animate-spin text-red-600" size={30} />
                <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-7xl">

                {/* Dashboard heading */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#102342]">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Manage your store and monitor activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
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

                {/* Navigation tabs */}
                <div className="mb-7 flex gap-2 overflow-x-auto rounded-xl border border-gray-100 bg-white p-2">
                    {tabs.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setActiveTab(value)}
                            className={`whitespace - nowrap rounded - lg px - 4 py - 3 text - sm font - semibold transition ${activeTab === value
                                    ? "bg-red-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                } `}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <section>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                title="Registered Customers"
                                value={summary?.total_users}
                                icon={Users}
                            />

                            <StatCard
                                title="Products"
                                value={summary?.total_products}
                                icon={Package}
                            />

                            <StatCard
                                title="Categories"
                                value={summary?.total_categories}
                                icon={Tags}
                            />

                            <StatCard
                                title="Total Orders"
                                value={summary?.total_orders}
                                icon={ShoppingBag}
                            />

                            <StatCard
                                title="Pending Orders"
                                value={summary?.pending_orders}
                                icon={TrendingUp}
                            />

                            <StatCard
                                title="Inventory Units"
                                value={summary?.inventory_units}
                                icon={Warehouse}
                            />
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Order Value (excluding cancelled orders)
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-green-700">
                                    ${Number(summary?.order_value ?? 0).toFixed(2)}
                                </h2>

                                <p className="mt-2 text-xs text-gray-400">
                                    This is order value, not confirmed payment revenue.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Low-stock products
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-red-600">
                                    {summary?.low_stock_products ?? 0}
                                </h2>

                                <p className="mt-2 text-xs text-gray-400">
                                    Active products with five or fewer units.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* PRODUCTS */}
                {activeTab === "products" && (
                    <section className="space-y-6">

                        {/* Product form */}
                        <form
                            onSubmit={handleProductSubmit}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <h2 className="mb-5 text-xl font-bold text-[#102342]">
                                {editingProductId !== null
                                    ? "Edit Product"
                                    : "Add Product"}
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleProductInput}
                                    placeholder="Product name"
                                    required
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="sku"
                                    value={productForm.sku}
                                    onChange={handleProductInput}
                                    placeholder="Product SKU"
                                    required
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={productForm.price}
                                    onChange={handleProductInput}
                                    placeholder="Price"
                                    required
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="discount_percent"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={productForm.discount_percent}
                                    onChange={handleProductInput}
                                    placeholder="Discount percentage"
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={productForm.stock}
                                    onChange={handleProductInput}
                                    placeholder="Stock quantity"
                                    required
                                    className="rounded-lg border p-3"
                                />

                                <select
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleProductInput}
                                    required
                                    className="rounded-lg border p-3"
                                >
                                    <option value="">Select category</option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="brand"
                                    value={productForm.brand}
                                    onChange={handleProductInput}
                                    className="rounded-lg border p-3"
                                >
                                    <option value="">Select brand (optional)</option>

                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={productForm.is_available}
                                        onChange={(event) =>
                                            setProductForm((previous) => ({
                                                ...previous,
                                                is_available: event.target.checked,
                                            }))
                                        }
                                    />
                                    Product is available
                                </label>
                            </div>

                            <textarea
                                name="description"
                                value={productForm.description}
                                onChange={handleProductInput}
                                placeholder="Product description"
                                rows={3}
                                className="mt-4 w-full rounded-lg border p-3"
                            />

                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProductId !== null
                                            ? "Save Changes"
                                            : "Create Product"}
                                </button>

                                {editingProductId !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelProductEdit}
                                        className="rounded-lg border px-5 py-3"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Product list */}
                        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">SKU</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Stock</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-t">
                                            <td className="p-4 font-semibold">
                                                {product.name}
                                            </td>

                                            <td className="p-4">
                                                {product.sku}
                                            </td>

                                            <td className="p-4">
                                                ${product.price}
                                            </td>

                                            <td className="p-4">
                                                {product.stock}
                                            </td>

                                            <td className="flex gap-3 p-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditProduct(product)
                                                    }
                                                    className="font-semibold text-blue-600"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteProduct(product.id)
                                                    }
                                                    className="font-semibold text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {products.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-6 text-center text-gray-500"
                                            >
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* CATEGORIES */}
                {activeTab === "categories" && (
                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold">
                            Manage Categories
                        </h2>

                        <form
                            onSubmit={handleCreateCategory}
                            className="mb-6 flex flex-wrap gap-3"
                        >
                            <input
                                value={categoryName}
                                onChange={(event) =>
                                    setCategoryName(event.target.value)
                                }
                                placeholder="Category name"
                                required
                                className="min-w-0 flex-1 rounded-lg border p-3"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
                            >
                                Add Category
                            </button>
                        </form>

                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between border-t py-4"
                            >
                                <span>{category.name}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteCategory(category.id)
                                    }
                                    className="text-sm font-semibold text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <p className="text-gray-500">No categories found.</p>
                        )}
                    </section>
                )}

                {/* BRANDS */}
                {activeTab === "brands" && (
                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold">
                            Manage Brands
                        </h2>

                        <form
                            onSubmit={handleCreateBrand}
                            className="mb-6 flex flex-wrap gap-3"
                        >
                            <input
                                value={brandName}
                                onChange={(event) =>
                                    setBrandName(event.target.value)
                                }
                                placeholder="Brand name"
                                required
                                className="min-w-0 flex-1 rounded-lg border p-3"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
                            >
                                Add Brand
                            </button>
                        </form>

                        {brands.map((brand) => (
                            <div
                                key={brand.id}
                                className="flex items-center justify-between border-t py-4"
                            >
                                <span>{brand.name}</span>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteBrand(brand.id)}
                                    className="text-sm font-semibold text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        {brands.length === 0 && (
                            <p className="text-gray-500">No brands found.</p>
                        )}
                    </section>
                )}

                {/* CUSTOMERS */}
                {activeTab === "users" && (
                    <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
                        <h2 className="p-5 text-xl font-bold">
                            Registered Customers
                        </h2>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Joined</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            {user.is_active ? "Active" : "Inactive"}
                                        </td>
                                        <td className="p-4">
                                            {user.created_at
                                                ? new Date(
                                                    user.created_at
                                                ).toLocaleDateString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}

                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="p-6 text-center text-gray-500"
                                        >
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
                        <h2 className="p-5 text-xl font-bold">
                            Manage Orders
                        </h2>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="p-4">
                                            {order.order_number
                                                ? String(order.order_number).slice(0, 8)
                                                : order.id}
                                        </td>

                                        <td className="p-4">
                                            <p className="font-semibold">
                                                {order.customer_name || "—"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.customer_email || ""}
                                            </p>
                                        </td>

                                        <td className="p-4">
                                            ${Number(order.total_amount ?? 0).toFixed(2)}
                                        </td>

                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(event) =>
                                                    handleOrderStatus(
                                                        order.id,
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border p-2"
                                            >
                                                {[
                                                    "pending",
                                                    "confirmed",
                                                    "shipped",
                                                    "delivered",
                                                    "cancelled",
                                                ].map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}

                                {orders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="p-6 text-center text-gray-500"
                                        >
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                )}
            </div>
        </main>
    );
}
