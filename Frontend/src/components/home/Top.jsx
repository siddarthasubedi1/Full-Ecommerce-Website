
// import bag from "../../assets/bag-home.jpg";
// import {
//     ChevronRight,
//     BadgeCheck,
//     Wallet,
//     RotateCcw,
//     Headset,
//     Van,
//     RefreshCcw,
//     ShieldCheck
// } from "lucide-react";

// const Top = () => {
//     const features = [
//         {
//             icon: BadgeCheck,
//             title: "Premium Quality",
//             description: "Carefully Selected",
//         },
//         {
//             icon: Wallet,
//             title: "Secure Payments",
//             description: "100% Safe & Secure",
//         },
//         {
//             icon: RotateCcw,
//             title: "Easy Returns",
//             description: "Hassle Free Returns",
//         },
//         {
//             icon: Headset,
//             title: "Customer Support",
//             description: "24/7 Friendly Support",
//         },
//     ];

//     const extraFeature = [
//         {
//             icon: Van,
//             title: "Free shipping",
//             description: "On orders over $50"
//         },
//         {
//             icon: RefreshCcw,
//             title: "30 days returns",
//             description: "No hassle returns"
//         },
//         {
//             icon: ShieldCheck,
//             title: "Secure payment",
//             description: "100% secure checkout"
//         },
//         {
//             icon: Headset,
//             title: "24/7 support",
//             description: "We're here to help"
//         },
//     ];

//     return (
//         <section className="relative w-full overflow-hidden bg-[#f7f3ef]">
//             {/* Main Hero Section */}
//             <div className="relative mx-auto flex min-h-[550px] max-w-[1600px] flex-col lg:flex-row">

//                 {/* Left Content */}
//                 <div className="relative z-10 flex w-full flex-col justify-center px-6 py-14 sm:px-12 lg:w-[55%] lg:px-20 lg:py-20">

//                     {/* Welcome Badge */}
//                     <div className="mb-5 w-fit rounded-md border border-gray-300 bg-white/70 px-4 py-2 shadow-sm">
//                         <p className="text-xs font-bold uppercase tracking-wider text-[#102342] sm:text-sm">
//                             Welcome to{" "}
//                             <span className="text-[#f97316]">
//                                 Pajji Store
//                             </span>
//                         </p>
//                     </div>

//                     {/* Main Heading */}
//                     <h1 className="text-4xl font-extrabold uppercase leading-[1.15] tracking-tight text-[#0b1e3b] sm:text-5xl xl:text-6xl line-clamp-2">
//                         Quality Products.
//                         <span className="mt-2 block text-[#f97316]">
//                             Trusted By Thousands.
//                         </span>
//                     </h1>

//                     {/* Description */}
//                     <p className="mt-6 max-w-[520px] text-base leading-8 text-gray-700 sm:text-lg">
//                         Discover a wide range of high-quality products
//                         carefully selected for your lifestyle.
//                     </p>

//                     {/* Buttons */}
//                     <div className="mt-8 flex flex-wrap items-center gap-4">
//                         <button
//                             type="button"
//                             className="flex items-center justify-center gap-3 rounded-md bg-[#f97316] px-8 py-4 text-sm font-bold uppercase text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#ea580c] hover:shadow-lg"
//                         >
//                             Shop Now
//                             <ChevronRight size={20} />
//                         </button>

//                         <button
//                             type="button"
//                             className="rounded-md border-2 border-[#f97316] bg-transparent px-8 py-4 text-sm font-bold uppercase text-[#102342] transition-all duration-300 hover:bg-[#f97316] hover:text-white"
//                         >
//                             Explore Collection
//                         </button>
//                     </div>
//                 </div>

//                 {/* Right Image Section */}
//                 <div className="relative flex min-h-[350px] w-full items-center justify-center overflow-hidden lg:min-h-[550px] lg:w-[45%]">

//                     {/* Orange Background Shape */}
//                     <div className="absolute -right-20 -top-24 h-[500px] w-[500px] rounded-full bg-[#fb8500] sm:h-[650px] sm:w-[650px]" />

//                     {/* Product Image */}
//                     <img
//                         src={bag}
//                         alt="Pajji Store featured collection"
//                         className="relative z-10 h-[330px] w-full object-contain drop-shadow-2xl sm:h-[440px] lg:h-[520px]"
//                     />
//                 </div>
//             </div>

//             {/* Main Features Grid */}
//             <div className="relative z-20 mx-auto grid max-w-[1600px] grid-cols-2 gap-6 border-t border-gray-200 bg-[#f7f3ef] px-6 py-8 sm:px-12 lg:grid-cols-4 lg:gap-8 lg:px-20">
//                 {features.map((feature, index) => {
//                     const Icon = feature.icon;

//                     return (
//                         <div
//                             key={index}
//                             className="flex items-start gap-3"
//                         >
//                             <div className="shrink-0 text-[#f97316]">
//                                 <Icon size={30} strokeWidth={1.8} />
//                             </div>

//                             <div>
//                                 <h3 className="text-sm font-bold text-[#102342] sm:text-base">
//                                     {feature.title}
//                                 </h3>

//                                 <p className="mt-1 text-xs text-gray-600 sm:text-sm">
//                                     {feature.description}
//                                 </p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Extra Features Bar (FIXED HERE) */}
//             <div className="border-t border-gray-300 bg-gray-200 px-6 py-4 sm:px-12 lg:px-20">
//                 <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                     {extraFeature.map((item, index) => {
//                         const Icon = item.icon;

//                         return (
//                             <div key={index} className="flex items-center gap-3">
//                                 <div className="shrink-0 text-[#f97316]">
//                                     <Icon size={26} strokeWidth={1.8} />
//                                 </div>

//                                 <div>
//                                     <h3 className="text-xs font-bold uppercase text-[#102342] sm:text-sm">
//                                         {item.title}
//                                     </h3>

//                                     <p className="text-xs text-gray-600">
//                                         {item.description}
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//         </section>
//     );
// };

// export default Top;


import { Link } from "react-router-dom";
import bag from "../../assets/bag-home.jpg";
import { ChevronRight, BadgeCheck, Wallet, RotateCcw, Headset, Truck, ShieldCheck } from "lucide-react";

const benefits = [
    { icon: BadgeCheck, title: "Premium Quality", desc: "Carefully selected" },
    { icon: Wallet, title: "Secure Payments", desc: "100% safe & secure" },
    { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free returns" },
    { icon: Headset, title: "Customer Support", desc: "Friendly assistance" },
];

export default function Top() {
    return (
        <section className="overflow-hidden bg-[#f7f3ef]">
            <div className="mx-auto flex min-h-[530px] max-w-[1600px] flex-col lg:flex-row">
                <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-[55%] lg:px-20">
                    <span className="mb-6 w-fit rounded-md border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#102342] shadow-sm">Welcome to <span className="text-[#f97316]">Pajji Store</span></span>
                    <h1 className="max-w-2xl text-4xl font-extrabold uppercase leading-tight tracking-tight text-[#0b1e3b] sm:text-5xl xl:text-6xl">Quality Products.<span className="mt-2 block text-[#f97316]">Trusted by Thousands.</span></h1>
                    <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">Discover a wide range of high-quality products carefully selected for your lifestyle.</p>
                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link to="/product" className="inline-flex items-center gap-3 rounded-md bg-[#f97316] px-7 py-4 text-sm font-bold uppercase text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#ea580c]">Shop Now <ChevronRight size={19} /></Link>
                        <Link to="/product" className="inline-flex items-center rounded-md border-2 border-[#f97316] px-7 py-4 text-sm font-bold uppercase text-[#102342] transition hover:bg-[#f97316] hover:text-white">Explore Collection</Link>
                    </div>
                </div>
                <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden lg:w-[45%]">
                    <div className="absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#fb8500] sm:h-[650px] sm:w-[650px]" />
                    <img src={bag} alt="Pajji Store featured collection" className="relative z-10 h-[350px] w-full object-contain drop-shadow-2xl sm:h-[440px] lg:h-[520px]" />
                </div>
            </div>
            <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-6 border-t border-slate-200 px-6 py-9 sm:px-12 lg:grid-cols-4 lg:px-20">
                {benefits.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3"><Icon size={29} className="shrink-0 text-[#f97316]" /><div><h3 className="text-sm font-bold text-[#102342] sm:text-base">{title}</h3><p className="mt-1 text-xs text-slate-500 sm:text-sm">{desc}</p></div></div>
                ))}
            </div>
            <div className="border-t border-slate-300 bg-slate-200/70 px-6 py-4">
                <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-4 text-xs font-bold uppercase text-[#102342] sm:grid-cols-4 sm:text-sm">
                    <span className="flex items-center gap-2"><Truck size={22} className="text-[#f97316]" /> Free shipping over $50</span>
                    <span className="flex items-center gap-2"><RotateCcw size={22} className="text-[#f97316]" /> 30-day returns</span>
                    <span className="flex items-center gap-2"><ShieldCheck size={22} className="text-[#f97316]" /> Secure checkout</span>
                    <span className="flex items-center gap-2"><Headset size={22} className="text-[#f97316]" /> Customer support</span>
                </div>
            </div>
        </section>
    );
}
