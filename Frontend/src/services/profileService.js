
import { API_BASE_URL } from "./apiConfig";

// Common function for communicating with profile APIs
const profileRequest = async (endpoint, method, body = null) => {

    // Get the JWT access token from localStorage
    const token = localStorage.getItem("access");

    // Prepare request headers
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const options = {
        method,
        headers,
    };

    // Add request body only when data is provided
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    let response;

    try {
        response = await fetch(
            `${API_BASE_URL}/account/${endpoint}/`,
            options
        );
    } catch {
        throw new Error(
            "Cannot connect to Django. Check whether the backend is running."
        );
    }

    // Convert API response into JavaScript data
    const data = await response.json().catch(() => ({}));

    // Handle API errors
    if (!response.ok) {
        const errors = data.errors || data;

        const message = Object.entries(errors)
            .map(([field, value]) => {
                const details = Array.isArray(value)
                    ? value.join(" ")
                    : typeof value === "string"
                        ? value
                        : JSON.stringify(value);

                return `${field}: ${details}`;
            })
            .join(" ");

        throw new Error(
            message || "Something went wrong. Please try again."
        );
    }

    return data;
};


// Get the logged-in user's profile
export const getMyProfile = () => {
    return profileRequest("profile", "GET");
};


// Update the logged-in user's profile
export const updateMyProfile = (formData) => {
    return profileRequest("profile", "PATCH", formData);
};


// Change the logged-in user's password
export const changeMyPassword = (formData) => {
    return profileRequest("change-password", "POST", formData);
};
