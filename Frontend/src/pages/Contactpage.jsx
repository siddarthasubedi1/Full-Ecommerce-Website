import {
    Smartphone,
    Mail,
    Clock,
    MapPin,
    Asterisk,
    ArrowUpRight,
    ChevronDown
} from 'lucide-react'

const Contactpage = () => {
    const information = [
        {
            icon: Smartphone,
            title: "Phone Number",
            description: "+977 06157329"
        },
        {
            icon: Mail,
            title: 'Email Address',
            description: 'pajjistore@gmail.com'
        },
        {
            icon: Clock,
            title: 'Opening Hour',
            description: 'Mon - Fri: 9:00 AM - 6:00 PM'
        },
        {
            icon: MapPin,
            title: 'Our Location',
            description: 'Kaski-Machhepuchre 13 Street, Pokhara'
        }
    ]

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-20 text-gray-800">

            {/* Hero Section */}
            <div className='flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-orange-700 to-transparent text-center'>
                <h1 className='text-8xl font-semibold font-sans cursor-pointer transition-all duration-300 hover:text-white hover:uppercase hover:underline hover:underline-offset-8 hover:decoration-[6px] hover:decoration-white'>
                    Contact Us
                </h1>
            </div>

            {/* Main Cards Section */}
            <div className="max-w-6xl mx-auto px-4 mt-16 flex flex-col lg:flex-row items-start justify-center gap-8">

                {/* LEFT CARD: Contact Information */}
                <div className="w-full lg:w-[420px] bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                        Have questions or need help with your digital project? Our team is always ready to assist you with professional solutions and reliable support. Feel free to contact us anytime and we will respond as quickly as possible.
                    </p>

                    <div className="mt-8 flex flex-col">
                        {information.map((item, index) => {
                            const IconComponent = item.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 py-5 ${index !== information.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className="text-[#F25C38] mt-1">
                                        <IconComponent className="w-6 h-6 stroke-[1.8]" />
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT CARD: Get In Touch Form */}
                <div className="w-full lg:w-[600px] bg-[#F5EFE9] rounded-3xl p-8 md:p-10 shadow-sm">

                    {/* Pill Tag */}
                    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm mb-6">
                        <Asterisk className="w-4 h-4 text-[#F25C38]" />
                        <span className="text-xs font-semibold text-gray-700">Get In Touch</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Get In Touch
                    </h2>
                    <p className="mt-3 text-xs text-gray-500 leading-relaxed mb-8">
                        We would love to hear about your project and help you grow your business online. Fill out the contact form and our team will get back to you soon with the best possible solution for your needs.
                    </p>

                    {/* Form */}
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Input: Name */}
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-[#EBE2D8] text-gray-800 placeholder-gray-500 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#F25C38]/50 transition-all"
                        />

                        {/* Input: Email */}
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-[#EBE2D8] text-gray-800 placeholder-gray-500 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#F25C38]/50 transition-all"
                        />

                        {/* Input: Phone */}
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full bg-[#EBE2D8] text-gray-800 placeholder-gray-500 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#F25C38]/50 transition-all"
                        />

                        {/* Select: Service */}
                        <div className="relative w-full">
                            <select defaultValue="" className="w-full bg-[#EBE2D8] text-gray-500 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#F25C38]/50 transition-all appearance-none cursor-pointer">
                                <option value="" disabled hidden>Service You're Interested</option>
                                <option value="web" className="text-gray-800">Web Development</option>
                                <option value="design" className="text-gray-800">UI/UX Design</option>
                                <option value="app" className="text-gray-800">App Development</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Textarea: Message */}
                        <textarea
                            placeholder="Message"
                            rows={4}
                            className="sm:col-span-2 w-full bg-[#EBE2D8] text-gray-800 placeholder-gray-500 text-xs rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#F25C38]/50 transition-all resize-none"
                        ></textarea>

                        {/* Submit Button */}
                        <div className="sm:col-span-2 mt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-[#F25C38] hover:bg-[#d84a28] text-white px-6 py-3 rounded-full font-medium text-xs transition-all duration-300 shadow-sm group"
                            >
                                Send Message
                                <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                                </div>
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* BOTTOM SECTION: Our Location Heading */}
            <div className="mt-20 text-center flex flex-col items-center max-w-2xl mx-auto px-4">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-sm mb-6">
                    <Asterisk className="w-4 h-4 text-[#F25C38]" />
                    <span className="text-xs font-semibold text-gray-700">Our Location</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    Visit Our Office For In-person Meetings And Consultations
                </h2>
            </div>

        </div>
    )
}

export default Contactpage