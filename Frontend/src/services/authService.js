

import { API_BASE_URL } from "./apiConfig";

// Send data to the Django API
const sendAuthRequest = async (endpoint, formData) => {
    let response;

    try {
        response = await fetch(
            `${API_BASE_URL}/account/${endpoint}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );
    } catch {
        throw new Error(
            "Cannot connect to Django. Make sure the backend server is running."
        );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const errors = data.errors || data;

        const message = Object.entries(errors)
            .map(([field, value]) => {
                const details = Array.isArray(value)
                    ? value.join(" ")
                    : typeof value === "string"
                        ? value
                        : JSON.stringify(value);

                return field === "non_field_errors"
                    ? details
                    : `${field}: ${details}`;
            })
            .join(" ");

        throw new Error(
            message || "Request failed. Please try again."
        );
    }

    return data;
};

// Existing registration function
const registerUser = (formData) =>
    sendAuthRequest("register", formData);

// New login function
export const loginUser = (formData) =>
    sendAuthRequest("login", formData);

export default registerUser;

