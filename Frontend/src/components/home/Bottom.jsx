// import gift from "../../assets/gift.jpg";
// import {
//     ChevronRight,
//     UsersRound,
//     Star,
//     ShoppingBag,
//     ShieldCheck,
// } from "lucide-react";

// const Bottom = () => {
//     const stats = [
//         {
//             icon: UsersRound,
//             number: "10K+",
//             description: "Happy Customers",
//         },
//         {
//             icon: Star,
//             number: "4.8",
//             description: "Customer Rating",
//         },
//         {
//             icon: ShoppingBag,
//             number: "500+",
//             description: "Quality Products",
//         },
//         {
//             icon: ShieldCheck,
//             number: "100%",
//             description: "Secure Checkout",
//         },
//     ];

//     return (
//         <section className="my-14 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-12 font-sans -mt-10">
//             {/* ── 1. Top Offer Banner ── */}
//             <div className="relative overflow-hidden rounded-xl bg-[#08162e] text-white flex flex-col md:flex-row items-center justify-between px-6 py-6 sm:px-12 lg:px-16 shadow-lg gap-6">
//                 {/* Left: Gift Box Image & Details */}
//                 <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
//                     {/* Gift Image Container */}
//                     <div className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-lg">
//                         <img
//                             src={gift}
//                             alt="Special Offer Gift"
//                             className="h-full w-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Text Container */}
//                     <div className="space-y-1">
//                         <span className="text-xs font-bold uppercase tracking-widest text-[#f97316]">
//                             Special Offer
//                         </span>
//                         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
//                             Up To <span className="text-[#f97316]">40% OFF</span>
//                         </h2>
//                         <p className="text-xs sm:text-sm text-gray-300 font-medium">
//                             Limited time offer on selected items.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right: Shop The Sale Button */}
//                 <button
//                     type="button"
//                     className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f97316] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#ea580c] active:scale-95"
//                 >
//                     Shop The Sale
//                     <ChevronRight size={16} />
//                 </button>
//             </div>

//             {/* ── 2. Why Shop With Us Section ── */}
//             <div className="space-y-8">
//                 {/* Header */}
//                 <div className="flex flex-col items-center justify-center">
//                     <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#0b1e3b]">
//                         Why <span className="text-[#f97316]">Shop</span> With Us?
//                     </h2>
//                     <div className="mt-2 h-1 w-12 rounded-full bg-[#0b1e3b]" />
//                 </div>

//                 {/* Stats Container Box */}
//                 <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
//                     <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-gray-100">
//                         {stats.map((item, index) => {
//                             const Icon = item.icon;

//                             return (
//                                 <div
//                                     key={index}
//                                     className="flex items-center justify-center gap-3.5 px-2"
//                                 >
//                                     <div className="shrink-0 text-[#f97316]">
//                                         <Icon size={32} strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-base sm:text-lg font-black text-[#0b1e3b]">
//                                             {item.number}
//                                         </h3>
//                                         <p className="text-xs font-medium text-gray-500 whitespace-nowrap">
//                                             {item.description}
//                                         </p>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Bottom;

import { Link } from "react-router";

export default function Bottom() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-[#0b1e3b] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Summer Sale is Live!</h2>
                    <p className="text-gray-300 mb-4">Up to 60% off on selected items. Don't miss out.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-[#f97316] px-6 py-2.5 rounded font-semibold hover:bg-orange-600 transition"
                    >
                        Grab the Deal
                    </Link>
                </div>
                <div className="flex gap-8 text-center">
                    {[
                        { num: "10K+", label: "Products" },
                        { num: "50K+", label: "Customers" },
                        { num: "99%", label: "Satisfaction" },
                    ].map((s, i) => (
                        <div key={i}>
                            <p className="text-2xl font-bold text-[#f97316]">{s.num}</p>
                            <p className="text-xs text-gray-300">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}