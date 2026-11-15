
import { API_BASE_URL } from "./apiConfig";


// Common function for review API requests
async function reviewRequest(endpoint = "", options = {}) {

    const access = localStorage.getItem("access");

    const headers = {
        "Content-Type": "application/json",
    };

    // Add authentication only when a token exists
    if (access) {
        headers.Authorization = `Bearer ${access}`;
    }

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/reviews/${endpoint}`,
            {
                ...options,
                headers,
            }
        );

    } catch {

        throw new Error("Cannot connect to Django backend.");

    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {

        const message =
            data.detail ||
            data.message ||
            data.rating ||
            data.comment ||
            "Something went wrong.";

        throw new Error(
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    return data;
}


// GET: Get product reviews
export const getProductReviews = (productId) => {

    return reviewRequest(
        `?product_id=${productId}`
    );

};


// POST: Add review
export const addProductReview = (productId, review) => {

    return reviewRequest("", {
        method: "POST",
        body: JSON.stringify({
            product_id: productId,
            rating: review.rating,
            comment: review.comment,
        }),
    });

};


// PATCH: Update review
export const updateProductReview = (reviewId, review) => {

    return reviewRequest(`${reviewId}/`, {
        method: "PATCH",
        body: JSON.stringify(review),
    });

};


// DELETE: Remove review
export const deleteProductReview = (reviewId) => {

    return reviewRequest(`${reviewId}/`, {
        method: "DELETE",
    });

};
