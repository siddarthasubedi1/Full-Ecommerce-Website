
const BASE_URL = (
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000"
).replace(/\/$/, "");


async function cartRequest(endpoint, options = {}) {
    let access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Please login first.");
    }

    const sendRequest = (token) => {
        return fetch(`${BASE_URL}/cart/${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    let response = await sendRequest(access);

    // Try refreshing an expired access token.
    if (response.status === 401) {
        const refresh = localStorage.getItem("refresh");

        if (refresh) {
            const refreshResponse = await fetch(
                `${BASE_URL}/account/token/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh }),
                }
            );

            if (refreshResponse.ok) {
                const tokens = await refreshResponse.json();

                localStorage.setItem("access", tokens.access);
                access = tokens.access;
                response = await sendRequest(access);
            } else {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.dispatchEvent(new Event("auth-changed"));
            }
        }
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
            data.quantity ||
            "Something went wrong.";

        throw new Error(
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    return data;
}


// GET - Retrieve user's cart
export const getCart = () => {
    return cartRequest("");
};


// POST - Add product to cart
export const addToCart = (productId, quantity = 1) => {
    return cartRequest("", {
        method: "POST",
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity,
        }),
    });
};


// PATCH - Update quantity
export const updateCartQuantity = (productId, quantity) => {
    return cartRequest(`${productId}/`, {
        method: "PATCH",
        body: JSON.stringify({
            quantity: quantity,
        }),
    });
};


// DELETE - Remove product
export const removeFromCart = (productId) => {
    return cartRequest(`${productId}/`, {
        method: "DELETE",
    });
};
