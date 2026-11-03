

// import { useEffect, useState } from "react";
// import { getAllProducts } from "../../services/productService";

// const ProductFilter = ({
//     selectedCategories = [],
//     selectedBrands = [],
//     onCategoryChange = () => { },
//     onBrandChange = () => { },
// }) => {
//     const [categories, setCategories] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchFilters = async () => {
//             try {
//                 setLoading(true);
//                 setError("");

//                 const data = await getAllProducts();
//                 const productsList = data.results ?? data;

//                 if (Array.isArray(productsList)) {
//                     const uniqueCategories = [
//                         ...new Set(
//                             productsList
//                                 .map((p) => p.category_name || p.category)
//                                 .filter(Boolean)
//                         ),
//                     ];

//                     const uniqueBrands = [
//                         ...new Set(
//                             productsList
//                                 .map((p) => p.brand_name || p.brand)
//                                 .filter(Boolean)
//                         ),
//                     ];

//                     setCategories(uniqueCategories);
//                     setBrands(uniqueBrands);
//                 }
//             } catch (error) {
//                 console.error("Failed to get filters:", error);
//                 setError("Unable to load filters.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilters();
//     }, []);

//     if (loading) {
//         return (
//             <div className="p-4 text-xs font-semibold text-gray-500">
//                 Loading filters...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-4 text-xs text-red-500">
//                 {error}
//             </div>
//         );
//     }

//     return (
//         <div className="w-full max-w-[260px] bg-white p-2 font-sans text-gray-700">

//             {/* Main Title */}
//             <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-200">
//                 Filter Options
//             </h2>

//             {/* By Categories */}
//             <div className="py-4 border-b border-gray-100">
//                 <h3 className="text-xs font-bold text-gray-800 mb-2.5">
//                     By Categories
//                 </h3>

//                 <div className="space-y-2">
//                     {categories.map((cat) => (
//                         <label
//                             key={cat}
//                             className="flex items-center gap-2 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
//                         >
//                             <input
//                                 type="checkbox"
//                                 checked={selectedCategories.includes(cat)}
//                                 onChange={() => onCategoryChange(cat)}
//                                 className="h-3.5 w-3.5 rounded border-gray-300 accent-[#1c3e2b] cursor-pointer"
//                             />

//                             <span>{cat}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>

//             {/* By Brands */}
//             <div className="py-4 border-b border-gray-100">
//                 <h3 className="text-xs font-bold text-gray-800 mb-2.5">
//                     By Brands
//                 </h3>

//                 <div className="space-y-2">
//                     {brands.map((brand) => (
//                         <label
//                             key={brand}
//                             className="flex items-center gap-2 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
//                         >
//                             <input
//                                 type="checkbox"
//                                 checked={selectedBrands.includes(brand)}
//                                 onChange={() => onBrandChange(brand)}
//                                 className="h-3.5 w-3.5 rounded border-gray-300 accent-[#1c3e2b] cursor-pointer"
//                             />

//                             <span>{brand}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default ProductFilter;


import useFetch from "../../hooks/useFetch";
import { getCategories, getBrands } from "../../services/productService";

export default function ProductFilter({
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    onCategoryChange,
    onBrandChange,
    onMinPriceChange,
    onMaxPriceChange,
}) {
    const { data: categories, loading: catLoading } = useFetch(() => getCategories(), []);
    const { data: brands, loading: brandLoading } = useFetch(() => getBrands(), []);

    return (
        <div>
            {/* Categories from Django */}
            <div>
                <h3 className="mb-3 text-lg font-bold text-[#102342]">Categories</h3>
                {catLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : categories?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-700">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat.name)}
                                    onChange={() => onCategoryChange(cat.name)}
                                    className="accent-red-600"
                                />
                                <span className="capitalize">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No categories found.</p>
                )}
            </div>

            {/* Brands from Django */}
            <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold text-[#102342]">Brands</h3>
                {brandLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : brands?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {brands.map((brand) => (
                            <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-700">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand.name)}
                                    onChange={() => onBrandChange(brand.name)}
                                    className="accent-red-600"
                                />
                                <span>{brand.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No brands found.</p>
                )}
            </div>

            {/* Price Range */}
            <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold text-[#102342]">Price Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onMinPriceChange(e.target.value)}
                        className="w-1/2 rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-red-500"
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(e.target.value)}
                        className="w-1/2 rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-red-500"
                        min="0"
                    />
                </div>
            </div>
        </div>
    );
}