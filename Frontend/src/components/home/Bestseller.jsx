
// import { Star, ShoppingCart } from "lucide-react";
// import { Link } from "react-router";
// import useFetch from "../../hooks/useFetch";
// import { getAllProducts } from "../../services/productService";

// const Bestseller = () => {
//     const { data: raw, loading } = useFetch(getAllProducts);
//     const product = raw?.results ?? raw ?? [];

//     const getBadgeText = (item, index) => {
//         if (item.discount_percentage && item.discount_percentage > 0) {
//             return `SAVE ${Math.round(item.discount_percentage)}%`;
//         }
//         if (index % 4 === 0) return "BEST SELLER";
//         if (index % 3 === 0) return "NEW";
//         return "SAVE 20%";
//     };

//     if (loading) {
//         return (
//             <div className="py-20 text-center text-base font-semibold text-gray-500">
//                 Loading Bestsellers...
//             </div>
//         );
//     }

//     return (
//         <section className="my-14 px-4 sm:px-8 max-w-[1600px] mx-auto">
//             <div className="relative mb-8 flex items-center justify-between">
//                 <div className="hidden sm:block w-24"></div>
//                 <div className="flex flex-col items-center justify-center mx-auto sm:mx-0">
//                     <h2 className="text-2xl font-black uppercase tracking-wider text-[#0b1e3b] sm:text-3xl lg:text-4xl">
//                         Best <span className="text-[#f97316]">Sellers</span>
//                     </h2>
//                     <div className="mt-2 h-1.5 w-14 rounded-full bg-[#0b1e3b]" />
//                 </div>
//                 <Link
//                     to="/product"
//                     className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0b1e3b] shadow-sm transition-all hover:bg-gray-100 hover:border-gray-400"
//                 >
//                     View All
//                 </Link>
//             </div>

//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//                 {product.slice(0, 15).map((item, index) => {
//                     const imgUrl = item.thumbnail_url || item.thumbnail || item.image;
//                     const name = item.name || item.title || "Product";
//                     const rating = item.rating || 4.5;
//                     const reviewCount = item.review_count || Math.floor(100 + index * 145);

//                     return (
//                         <div
//                             key={item.id}
//                             className="group flex flex-col justify-between rounded-xl bg-white p-3 shadow-sm border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:border-gray-300"
//                         >
//                             <div>
//                                 <div className="relative flex h-52 w-full items-center justify-center rounded-lg bg-[#f5f3ef] p-4">
//                                     <span className="absolute left-2.5 top-2.5 rounded bg-[#f97316] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
//                                         {getBadgeText(item, index)}
//                                     </span>
//                                     {imgUrl ? (
//                                         <img
//                                             src={imgUrl}
//                                             alt={name}
//                                             className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
//                                         />
//                                     ) : (
//                                         <div className="text-xs font-semibold text-gray-400">No Image</div>
//                                     )}
//                                 </div>
//                                 <div className="mt-3 px-1">
//                                     <h3 className="text-sm font-bold text-[#0b1e3b] line-clamp-1 group-hover:text-[#f97316] transition-colors">
//                                         {name}
//                                     </h3>
//                                     <div className="mt-1.5 flex items-center gap-1">
//                                         <div className="flex text-amber-400">
//                                             {[...Array(5)].map((_, i) => (
//                                                 <Star
//                                                     key={i}
//                                                     size={13}
//                                                     className={
//                                                         i < Math.floor(rating)
//                                                             ? "fill-amber-400 text-amber-400"
//                                                             : "fill-gray-200 text-gray-200"
//                                                     }
//                                                 />
//                                             ))}
//                                         </div>
//                                         <span className="text-xs font-semibold text-gray-500">
//                                             ({reviewCount.toLocaleString()})
//                                         </span>
//                                     </div>
//                                     <div className="mt-2 flex items-baseline gap-2">
//                                         <span className="text-lg font-black text-[#0b1e3b]">
//                                             ${item.discounted_price ?? item.price}
//                                         </span>
//                                         {item.price && (
//                                             <span className="text-xs font-semibold text-gray-400 line-through">
//                                                 ${(parseFloat(item.price) * 1.3).toFixed(2)}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                             <button
//                                 type="button"
//                                 className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f97316] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition-all duration-200 hover:bg-[#ea580c] active:scale-95"
//                             >
//                                 <ShoppingCart size={15} />
//                                 Add to Cart
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </section>
//     );
// };

// export default Bestseller;


import { Link } from "react-router";
import { Star } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { getAllProducts } from "../../services/productService";

export default function Bestseller() {
    const { data: products, loading } = useFetch(() => getAllProducts(), []);

    if (loading) return <p className="text-center py-8 text-gray-400">Loading...</p>;
    if (!products?.length) return null;

    const top = products.slice(0, 15);

    return (
        <section className="bg-[#f7f3ef] py-16">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-[#102342] mb-8">Bestsellers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {top.map((p) => (
                        <Link
                            key={p.id}
                            to={`/products/${p.id}`}
                            className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition duration-300 group"
                        >
                            <div className="relative">
                                <img
                                    src={p.thumbnail}
                                    alt={p.title}
                                    className="w-full h-44 object-contain bg-[#f9f8f6] p-3 group-hover:scale-105 transition"
                                />
                                {p.discountPercentage > 10 && (
                                    <span className="absolute top-2 left-2 bg-[#f97316] text-white text-xs px-2 py-0.5 rounded-full">
                                        -{Math.round(p.discountPercentage)}%
                                    </span>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                                <p className="font-semibold text-[#0b1e3b] text-sm truncate">{p.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">{p.rating}</span>
                                </div>
                                <p className="text-[#f97316] text-lg font-bold mt-2">${p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}