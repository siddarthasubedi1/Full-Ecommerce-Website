const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function getJSON(url) {
    let response;
    try {
        response = await fetch(url);
    } catch {
        throw new Error("Cannot connect. Check that the server is running.");
    }
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
}

export const getAllProducts = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);

    const query = params.toString();
    const url = `${BASE_URL}/product/proxy/${query ? "?" + query : ""}`;
    const data = await getJSON(url);
    return data.results ?? [];
};
//get single product details by id 
export const getProductById = (id) => getJSON(`${BASE_URL}/product/proxy/${id}/`)

// Categories from DummyJSON via Django proxy
export const getCategories = () => getJSON(`${BASE_URL}/product/proxy/categories/`);

// Brands from DummyJSON via Django proxy
export const getBrands = () => getJSON(`${BASE_URL}/product/proxy/brands/`);