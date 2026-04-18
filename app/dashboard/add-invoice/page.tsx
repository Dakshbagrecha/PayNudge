"use client";
export const dynamic = "force-dynamic";


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddInvoice() {
    const router = useRouter();

    const [form, setForm] = useState({
        client: "",
        phone: "",
        amount: "",
        dueDate: "",
    });

    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!form.client || !form.phone || !form.amount || !form.dueDate) {
            setError("All fields are required");
            return;
        }

        const digits = form.phone.replace(/\D/g, "");
        const phone10 = digits.slice(-10);

        if (phone10.length !== 10) {
            setError("Enter valid 10-digit phone number");
            return;
        }

        if (!/^[a-zA-Z.\s]+$/.test(form.client)) {
            setError("Client name should only contain letters");
            return;
        }

        if (Number(form.amount) <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        const today = new Date();
        const due = new Date(form.dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
            setError("Due date cannot be in the past");
            return;
        }

        await fetch("/api/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client: form.client,
                phone: phone10, // only 10 digits
                amount: Number(form.amount),
                dueDate: form.dueDate,
            }),
        });

        router.push("/dashboard");
    }

    return (
        <main className="bg-[#F9FAFB] min-h-screen px-6 py-10">

            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-200">

                <h1 className="text-2xl font-semibold text-[#111827]">
                    Add Invoice
                </h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                    {/* Client Name */}
                    <input
                        type="text"
                        name="client"
                        placeholder="Client Name"
                        value={form.client}
                        onChange={(e) => {
                            let value = e.target.value;

                            // allow letters, spaces, and dot only
                            value = value.replace(/[^a-zA-Z.\s]/g, "");

                            setForm({
                                ...form,
                                client: value,
                            });
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500"
                    />

                    {/* Phone Number */}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone.replace("+91 ", "")}
                        onChange={(e) => {
                            // ALWAYS sanitize — source of truth
                            const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);

                            setForm({
                                ...form,
                                phone: digitsOnly ? `+91 ${digitsOnly}` : "",
                            });
                        }}
                        inputMode="numeric"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 px-1 -mt-2 mb-3 leading-tight">
                        Enter a number that is active on WhatsApp (used for payment reminders)
                    </p>

                    {/* Amount */}
                    <input
                        type="number"
                        min={1}
                        name="amount"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500"
                    />

                    {/* Due Date */}
                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 text-gray-500 rounded-lg px-4 py-2"
                    />

                    <button
                        type="submit"
                        disabled={!form.client || !form.phone || !form.amount || !form.dueDate}
                        className={`w-full py-2 rounded-lg text-white ${!form.client || !form.phone || !form.amount || !form.dueDate
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#111827] hover:opacity-90"
                            }`}
                    >
                        Save Invoice
                    </button>

                </form>
            </div>

        </main>
    );
}
