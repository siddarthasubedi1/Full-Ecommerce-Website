
import trolley from "../assets/trolley.jpg";
import storebag from "../assets/store-bag.png";
import { ArrowRight, Truck, ShieldCheck, Headset, Tag, ShoppingBag, Star, RotateCcw, Heart } from 'lucide-react'

export default function Aboutpage() {
    return (
        <div className="mx-12 mt-5">
            {/* ── Banner Container ── */}
            <div className="relative min-h-[200px] sm:min-h-[220px] md:min-h-[250px] w-full overflow-hidden rounded-2xl bg-[#081B33] shadow-lg">

                {/* 1. Right Side Image (Using your imported trolley asset) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={trolley}
                        alt="Shopping trolley"
                        className="h-full w-full object-cover object-right"
                    />
                </div>

                {/* 2. Dark Navy Wave Overlay (Left Side) */}
                <div className="absolute inset-y-0 left-0 z-10 w-full sm:w-[70%] md:w-[60%] lg:w-[52%]">
                    <svg
                        className="h-full w-full text-[#081B33]"
                        viewBox="0 0 600 300"
                        preserveAspectRatio="none"
                        fill="currentColor"
                    >
                        {/* Dark Blue Main Wave */}
                        <path d="M0,0 L450,0 C530,90 390,210 570,300 L0,300 Z" />
                        {/* Shadow Curve Layer */}
                        <path
                            d="M0,0 L400,0 C470,100 350,200 500,300 L0,300 Z"
                            fill="#051224"
                            opacity="0.4"
                        />
                    </svg>

                    {/* 3. Bottom-Left Orange Curve Accent */}
                    <div className="absolute bottom-0 left-0 z-20 h-16 w-36 sm:h-20 sm:w-44">
                        <svg
                            className="h-full w-full text-orange-500"
                            viewBox="0 0 200 100"
                            preserveAspectRatio="none"
                            fill="currentColor"
                        >
                            <path d="M0,100 C70,100 90,35 200,100 Z" />
                        </svg>
                    </div>
                </div>

                {/* 4. Banner Content Layer */}
                <div className="relative z-30 flex min-h-[200px] sm:min-h-[220px] md:min-h-[250px] flex-col justify-center px-8 py-6 md:px-14">
                    {/* Heading */}
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                        About <span className="text-orange-500">Us</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-2 text-xs font-medium text-gray-200 sm:text-sm md:text-base">
                        Your one-stop shop for a better shopping experience!
                    </p>

                    {/* Orange Line Under Subtitle */}
                    <div className="mt-3 h-1 w-14 rounded-full bg-orange-500 md:h-1.5 md:w-20" />
                </div>

            </div>

            {/* Other sections */}

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center">

                {/* 1. Left Image */}
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl lg:w-[35%]">
                    <img src={storebag} alt="storebag" className="h-full w-full object-cover" />
                    {/* Bottom Orange Curve */}
                    <div className="absolute bottom-0 left-0 h-16 w-32">
                        <svg className="h-full w-full text-orange-500" viewBox="0 0 200 100" preserveAspectRatio="none" fill="currentColor">
                            <path d="M0,100 C70,100 90,35 200,100 Z" />
                        </svg>
                    </div>
                </div>

                {/* 2. Middle Text Content */}
                <div className="flex-1">
                    {/* Subtitle with Orange Bar */}
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-8 rounded-full bg-orange-500" />
                        <h2 className="text-sm font-bold text-[#081B33]">Who We Are</h2>
                    </div>

                    <h1 className="mt-1 text-3xl font-extrabold text-[#081B33] sm:text-4xl">
                        Welcome to <span className="text-orange-500">Pajji Store</span>
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        Pajji Store is an online shopping platform dedicated to bringing you the best products at the best prices. We believe in making shopping simple, enjoyable, and affordable for everyone.
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        From fashion and electronics to home essentials and more — we've got you covered with a wide range of high-quality products, fast delivery, and excellent customer support.
                    </p>

                    {/* Shop Now Button */}
                    <button className="mt-4 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-600">
                        Shop Now <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {/* 3. Right Highlights Card */}
                <div className="w-full rounded-2xl bg-[#F7EFE5] p-6 lg:w-[30%]">
                    <h3 className="text-xl font-extrabold text-[#081B33]">Our Highlights</h3>
                    <div className="mt-1 h-1 w-12 rounded-full bg-orange-500" />

                    {/* 2x2 Grid with Dividers */}
                    <div className="mt-4 grid grid-cols-2 text-center text-xs font-bold text-[#081B33]">
                        <div className="flex flex-col items-center border-b border-r border-gray-300/60 p-3">
                            <Truck className="h-7 w-7 mb-2" />
                            <span>Fast &amp; Reliable<br />Delivery</span>
                        </div>
                        <div className="flex flex-col items-center border-b border-gray-300/60 p-3">
                            <ShieldCheck className="h-7 w-7 mb-2" />
                            <span>Secure<br />Payments</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-gray-300/60 p-3">
                            <Headset className="h-7 w-7 mb-2" />
                            <span>24/7 Customer<br />Support</span>
                        </div>
                        <div className="flex flex-col items-center p-3">
                            <Tag className="h-7 w-7 mb-2" />
                            <span>Best Prices<br />Always</span>
                        </div>
                    </div>
                </div>

            </div>


            {/* button section */}
            {/* <div className="mt-4 flex justify-between gap-4">

                <div className="bg-[#f2e6d9] h-[150px] w-[800px] rounded-xl">
                    <h1 className="text-4xl font-bold mt-2 ml-7">Why Choose Pajji Store?</h1>
                    <h3 className="ml-7">Because your satification is our priority.</h3>
                </div>
                <div>b</div>
            </div> */}

            <div className="mt-6 flex flex-col gap-5 lg:flex-row">

                {/* ── 1. Left Cream Card ── */}
                <div className="flex flex-col justify-between rounded-2xl bg-[#F8EFE4] px-6 py-5 sm:px-8 lg:w-[68%]">

                    {/* Title & Subtitle */}
                    <div>
                        <h2 className="text-xl font-extrabold text-[#081B33] sm:text-2xl">
                            Why Choose Pajji Store?
                        </h2>
                        <p className="mt-0.5 text-xs font-medium text-gray-700 sm:text-sm">
                            Because your satisfaction is our priority.
                        </p>
                    </div>

                    {/* 4 Feature Columns with Vertical Dividers */}
                    <div className="mt-4 grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">

                        {/* Item 1 */}
                        <div className="flex flex-col items-center text-center sm:border-r sm:border-gray-300/80 sm:px-2">
                            <ShoppingBag className="h-6 w-6 text-[#081B33]" />
                            <span className="mt-1.5 text-xs font-bold leading-tight text-[#081B33]">
                                Wide Variety<br />of Products
                            </span>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col items-center text-center sm:border-r sm:border-gray-300/80 sm:px-2">
                            <Star className="h-6 w-6 fill-[#081B33] text-[#081B33]" />
                            <span className="mt-1.5 text-xs font-bold leading-tight text-[#081B33]">
                                Trusted by<br />Thousands
                            </span>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col items-center text-center sm:border-r sm:border-gray-300/80 sm:px-2">
                            <RotateCcw className="h-6 w-6 text-[#081B33]" />
                            <span className="mt-1.5 text-xs font-bold leading-tight text-[#081B33]">
                                Easy Returns<br />&amp; Refunds
                            </span>
                        </div>

                        {/* Item 4 */}
                        <div className="flex flex-col items-center text-center sm:px-2">
                            <Heart className="h-6 w-6 text-[#081B33]" />
                            <span className="mt-1.5 text-xs font-bold leading-tight text-[#081B33]">
                                A Better<br />Shopping Experience
                            </span>
                        </div>

                    </div>
                </div>


                {/* ── 2. Right Dark Navy Card ── */}
                <div className="relative flex min-h-[170px] overflow-hidden rounded-2xl bg-[#081B33] px-6 py-5 text-white lg:w-[32%] sm:px-8">

                    {/* Text Content */}
                    <div className="z-10 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-extrabold leading-tight sm:text-2xl">
                                Shop Smart.<br />
                                Shop <span className="text-orange-500">Better.</span>
                            </h3>
                            <p className="mt-1 text-xs font-medium text-gray-300">
                                Only at Pajji Store!
                            </p>
                        </div>

                        {/* Explore Products Button */}
                        <div className="mt-3">
                            <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-orange-600">
                                Explore Products <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="absolute -right-2 bottom-0 h-28 w-28 sm:h-36 sm:w-36">
                        <img
                            src={trolley}
                            alt="Shopping Cart"
                            className="h-full w-full object-contain object-bottom"
                        />
                    </div>

                    {/* Top-Right Spark Accent */}
                    <div className="absolute right-3 top-3 text-orange-500">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                    </div>

                </div>

            </div>
        </div>
    );
}