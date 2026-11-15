
import { API_BASE_URL } from "./apiConfig";


// Common function for wishlist API requests
async function wishlistRequest(endpoint = "", options = {}) {

    let access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Please login first.");
    }

    // Send request using JWT access token
    const sendRequest = (token) => {
        return fetch(`${API_BASE_URL}/wishlist/${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    let response = await sendRequest(access);


    // Refresh access token if expired
    if (response.status === 401) {

        const refresh = localStorage.getItem("refresh");

        if (refresh) {

            const refreshResponse = await fetch(
                `${API_BASE_URL}/account/token/refresh/`,
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

                response = await sendRequest(tokens.access);

            } else {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.dispatchEvent(new Event("auth-changed"));
            }
        }
    }


    // Handle empty response
    if (response.status === 204) {
        return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {

        const message =
            data.detail ||
            data.message ||
            data.error ||
            data.product_id ||
            "Something went wrong.";

        throw new Error(
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    return data;
}


// GET: View wishlist
export const getWishlist = () => {
    return wishlistRequest("");
};


// POST: Add product
export const addToWishlist = (productId) => {
    return wishlistRequest("", {
        method: "POST",
        body: JSON.stringify({
            product_id: productId,
        }),
    });
};


// DELETE: Remove product
export const removeFromWishlist = (productId) => {
    return wishlistRequest(`${productId}/`, {
        method: "DELETE",
    });
};


// POST: Move product to cart
export const moveWishlistToCart = (productId) => {
    return wishlistRequest(`${productId}/move-to-cart/`, {
        method: "POST",
    });
};
