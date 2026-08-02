import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f5f5f0] px-6 py-24">
      <div className="w-full max-w-2xl rounded-[36px] border border-black/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-400">
          <CheckCircle2 className="h-10 w-10 text-black" />
        </div>

        <p className="mt-7 text-sm font-black uppercase tracking-[0.28em] text-lime-600">
          Enquiry Received
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-black sm:text-5xl">
          Thank You!
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-black/60">
          Your enquiry has been submitted successfully. Our team will
          contact you shortly to discuss your project.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-lime-400 hover:text-black"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}