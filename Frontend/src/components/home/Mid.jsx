
// import { useMemo } from "react";
// import SliderPkg from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { getAllProducts } from "../../services/productService";
// import useFetch from "../../hooks/useFetch";
// import Bestseller from "./Bestseller";

// const Slider = SliderPkg.default || SliderPkg;

// const CustomPrevArrow = ({ onClick }) => (
//     <button
//         onClick={onClick}
//         className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 flex h-14 w-14 mr-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 sm:-left-8"
//         aria-label="Previous"
//     >
//         <ChevronLeft className="h-8 w-8 text-gray-800" />
//     </button>
// );

// const CustomNextArrow = ({ onClick }) => (
//     <button
//         onClick={onClick}
//         className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 flex h-14 w-14 ml-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 sm:-right-8"
//         aria-label="Next"
//     >
//         <ChevronRight className="h-8 w-8 text-gray-800" />
//     </button>
// );

// const Mid = () => {
//     const { data: raw, loading } = useFetch(getAllProducts);
//     const data = raw?.results ?? raw ?? [];

//     const categories = useMemo(() => {
//         if (!Array.isArray(data)) return [];

//         const categoryMap = new Map();

//         data.forEach((item) => {
//             const catName = item.category_name || item.category || "General";
//             if (!categoryMap.has(catName)) {
//                 categoryMap.set(catName, {
//                     id: item.id || catName,
//                     name: catName,
//                     image: item.thumbnail_url || item.thumbnail || (item.images && item.images[0]) || "",
//                 });
//             }
//         });

//         return Array.from(categoryMap.values());
//     }, [data]);

//     const settings = {
//         dots: false,
//         infinite: categories.length > 4,
//         speed: 500,
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         autoplay: true,
//         autoplaySpeed: 3500,
//         arrows: true,
//         prevArrow: <CustomPrevArrow />,
//         nextArrow: <CustomNextArrow />,
//         responsive: [
//             { breakpoint: 1280, settings: { slidesToShow: 3 } },
//             { breakpoint: 868, settings: { slidesToShow: 2 } },
//             { breakpoint: 520, settings: { slidesToShow: 1 } },
//         ],
//     };

//     if (loading) {
//         return (
//             <div className="py-20 text-center text-base font-semibold text-gray-500">
//                 Loading Categories...
//             </div>
//         );
//     }

//     return (
//         <section className="bg-white py-16 px-4 sm:px-8">
//             <div className="mx-auto max-w-[1600px]">
//                 <div className="mb-14 flex flex-col items-center justify-center">
//                     <h2 className="text-2xl font-black uppercase tracking-wider text-[#0b1e3b] sm:text-3xl lg:text-4xl">
//                         Shop By <span className="text-[#f97316]">Category</span>
//                     </h2>
//                     <div className="mt-3 h-1.5 w-16 rounded-full bg-[#0b1e3b]" />
//                 </div>

//                 <div className="relative px-6 sm:px-12">
//                     {categories.length > 0 ? (
//                         <Slider {...settings}>
//                             {categories.map((cat) => (
//                                 <div key={cat.id} className="p-4 outline-none">
//                                     <div className="group flex flex-col items-center cursor-pointer">
//                                         <div className="flex h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80 items-center justify-center rounded-full bg-[#f4f2ed] p-8 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
//                                             {cat.image ? (
//                                                 <img
//                                                     src={cat.image}
//                                                     alt={cat.name}
//                                                     className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
//                                                 />
//                                             ) : (
//                                                 <div className="text-sm font-semibold text-gray-400">No Image</div>
//                                             )}
//                                         </div>
//                                         <h3 className="mt-6 text-center text-lg font-extrabold text-[#0b1e3b] capitalize transition-colors duration-200 group-hover:text-[#f97316] sm:text-xl">
//                                             {cat.name}
//                                         </h3>
//                                     </div>
//                                 </div>
//                             ))}
//                         </Slider>
//                     ) : (
//                         <p className="text-center text-gray-500">No categories found.</p>
//                     )}
//                 </div>
//             </div>

//             <Bestseller />
//         </section>
//     );
// };

// export default Mid;

import { Link } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getCategories } from "../../services/productService";
import Bestseller from "./Bestseller";

export default function Mid() {
    const { data: categories } = useFetch(() => getCategories(), []);

    return (
        <>
            {categories?.length > 0 && (
                <section className="max-w-7xl mx-auto px-5 py-16">
                    <h2 className="text-3xl font-extrabold text-[#102342] mb-8">Shop by Category</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/product?category=${cat.name}`}
                                className="min-w-[165px] shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm p-7 text-center hover:-translate-y-1 hover:border-[#f97316] hover:shadow-md transition"
                            >
                                <p className="font-semibold text-[#0b1e3b] capitalize">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            <Bestseller />
        </>
    );
}