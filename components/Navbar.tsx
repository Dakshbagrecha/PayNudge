import Link from "next/link"
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-300 text-[#111827]">
            <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="PayNudge logo"
                        width={140}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-6">

                    <a
                        href="#how-it-works"
                        className="hidden md:block text-sm text-gray-600 hover:text-black transition"
                    >
                        How it works
                    </a>

                    <Link href="/dashboard">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                            Get Started
                        </button>
                    </Link>

                </div>
            </div>
        </nav>
    )
}