export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="pt-10 pb-16 md:pt-12 md:pb-20 px-6 md:px-10 max-w-5xl mx-auto"
        >
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-lg font-medium text-green-600 mb-2">
                    How it works
                </p>

                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
                    Get paid in 3 simple steps
                </h2>

                <p className="mt-3 text-gray-600 text-sm md:text-base">
                    No chasing, no awkward follow-ups. Just set it once and let PayNudge handle the rest.
                </p>
            </div>

            <div className="mt-14 md:mt-16 grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">
                        🧾
                    </div>
                    <div className="text-sm text-green-600 font-medium mt-4">Step 1</div>
                    <h3 className="mt-2 font-semibold text-lg">
                        Add your invoice
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Enter client details, amount, and due date in seconds.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                        💬
                    </div>
                    <div className="text-sm text-blue-600 font-medium mt-4">Step 2</div>
                    <h3 className="mt-2 font-semibold text-lg">
                        We send reminders
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Automated WhatsApp nudges are sent at the right time.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-lg">
                        💸
                    </div>
                    <div className="text-sm text-purple-600 font-medium mt-4">Step 3</div>
                    <h3 className="mt-2 font-semibold text-lg">
                        Get paid faster
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Clients pay using the link — no awkward follow-ups.
                    </p>
                </div>

            </div>
        </section>
    );
}