
import DashboardPreview from "@/components/Dashboardpreview";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/Steps";
import Navbar from "@/components/Navbar";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F9FAFB] text-[#111827] min-h-screen pt-8">
        <Hero />

        <section className="px-6 md:px-8 pt-8 pb-6 md:pt-10 md:pb-8">
          <DashboardPreview />
        </section>

        <section className="px-6 md:px-8 pt-2 pb-14 md:pt-4 md:pb-16">
          <div className="max-w-6xl mx-auto rounded-4xl bg-white/60 shadow-sm">
            <HowItWorks />
          </div>
        </section>
      </main>
    </>
  );
}

