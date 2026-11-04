
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