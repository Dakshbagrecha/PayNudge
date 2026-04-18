"use client"

import Link from "next/link";

export default function Hero() {
    return (
        <section className="px-6 md:px-8 pt-14 pb-4 md:pt-20 md:pb-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start md:items-center">
            {/* LEFT */}
            <div className="space-y-5 max-w-xl">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    Stop chasing. <br /> <span className="text-green-600">Start getting paid.</span>
                </h1>
                <p className="text-lg text-gray-600">
                    <span className="text-black font-bold">PayNudge</span> sends automated reminders on WhatsApp.  <br />
                    No awkward follow-ups , Just faster payments.
                </p>

                <div className="flex gap-4 items-center">
                    <Link
                        href="/dashboard"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition duration-200"
                    >
                        Get Started
                    </Link>

                    <button
                        onClick={() => {
                            document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition duration-200"
                    >
                        See Demo
                    </button>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center md:justify-end md:mt-6">
                <div className="bg-white rounded-2xl shadow-md p-5 w-80 transition duration-300 hover:shadow-lg">

                    {/* Phone header */}
                    <div className="flex items-center gap-2 border-b pb-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-700">P</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">PayNudge</p>
                            <p className="text-xs text-gray-500">WhatsApp Business</p>
                        </div>
                    </div>

                    {/* Chat messages */}
                    <div className="mt-4 space-y-3">

                        <div className="bg-gray-100 p-3 rounded-xl text-sm text-gray-800 max-w-[85%]">
                            Hi Raj, just a reminder that your invoice of ₹15,000 is due.
                        </div>

                        <div className="bg-gray-100 p-3 rounded-xl text-sm text-gray-800 max-w-[85%]">
                            You can pay using the link below.
                        </div>

                        <div className="bg-gray-100 p-3 rounded-xl max-w-[85%]">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                                Pay Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    )
}