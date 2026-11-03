

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

// const registerUser = async (formData) => {
//     let response;

//     try {
//         response = await fetch(
//             `${API_BASE_URL}/account/register/`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formData),
//             }
//         );
//     } catch {
//         throw new Error(
//             "Cannot connect to the server. Make sure Django is running."
//         );
//     }

//     const data = await response.json().catch(() => ({}));

//     if (!response.ok) {
//         const message = Object.entries(data)
//             .map(([field, errors]) => {
//                 const details = Array.isArray(errors)
//                     ? errors.join(" ")
//                     : typeof errors === "string"
//                         ? errors
//                         : JSON.stringify(errors);

//                 return `${field}: ${details}`;
//             })
//             .join(" ");

//         throw new Error(
//             message || "Registration failed. Please try again."
//         );
//     }

//     return data;
// };

// export default registerUser;
