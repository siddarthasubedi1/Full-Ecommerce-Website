
import { API_BASE_URL } from "./apiConfig";


// Common function for authenticated order requests
async function orderRequest(endpoint, options = {}) {

    let access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Please login first.");
    }

    // Send request with access token
    const sendRequest = (token) => {
        return fetch(`${API_BASE_URL}/orders/${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    let response = await sendRequest(access);

    // Refresh expired access token
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {

        const message =
            data.detail ||
            data.message ||
            data.error ||
            "Something went wrong.";

        throw new Error(
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    return data;
}


// GET - Retrieve user's order history
export const getOrderHistory = () => {
    return orderRequest("");
};


// POST - Place an order from the user's cart
export const placeOrder = () => {
    return orderRequest("checkout/", {
        method: "POST",
    });
};
