// "use client";
// export const dynamic = "force-dynamic";


// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// type Invoice = {
//     id: number;
//     client: string;
//     phone: string;
//     amount: number;
//     dueDate: string;
//     status: "Paid" | "Pending";

//     remindersStarted?: boolean;
//     reminderCount?: number;
//     lastReminderDate?: string | null;
// };

// export default function Dashboard() {
//     const [invoices, setInvoices] = useState<Invoice[]>([]);
//     const pathname = usePathname();

//     useEffect(() => {
//         const stored = localStorage.getItem("invoices");
//         if (stored) {
//             setInvoices(JSON.parse(stored));
//         } else {
//             setInvoices([]);
//         }
//     }, []);

//     useEffect(() => {
//         let updated = [...invoices];
//         let changed = false;

//         updated = updated.map((inv) => {
//             if (!inv.remindersStarted || inv.status === "Paid") return inv;

//             if (!shouldSendReminder(inv)) return inv;

//             const message = generateReminderMessage(inv);

//             // 🔥 THIS WILL BE WHATSAPP LATER
//             console.log("AUTO REMINDER:", message);

//             changed = true;

//             return {
//                 ...inv,
//                 reminderCount: (inv.reminderCount || 0) + 1,
//                 lastReminderDate: new Date().toISOString(),
//             };
//         });

//         if (changed) {
//             setInvoices(updated);
//             localStorage.setItem("invoices", JSON.stringify(updated));
//         }
//     }, [invoices]);

//     // STATS
//     const totalInvoices = invoices.length;
//     const pending = invoices.filter(i => i.status === "Pending").length;
//     const collected = invoices
//         .filter(i => i.status === "Paid")
//         .reduce((sum, i) => sum + i.amount, 0);

//     function getReminderStatus(dueDate: string) {
//         const today = new Date();
//         const due = new Date(dueDate);

//         // remove time difference
//         today.setHours(0, 0, 0, 0);
//         due.setHours(0, 0, 0, 0);

//         const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

//         if (diff > 0) return "Upcoming";
//         if (diff === 0) return "Due Today";
//         return "Overdue";
//     }

//     function shouldSendReminder(inv: Invoice) {
//         if (!inv.remindersStarted) return false;

//         const today = new Date();
//         const due = new Date(inv.dueDate);

//         const totalDays = Math.ceil(
//             (due.getTime() - new Date(inv.lastReminderDate || today).getTime()) /
//             (1000 * 60 * 60 * 24)
//         );

//         const daysLeft = Math.ceil(
//             (due.getTime() - today.getTime()) /
//             (1000 * 60 * 60 * 24)
//         );

//         const lastSent = inv.lastReminderDate
//             ? new Date(inv.lastReminderDate)
//             : null;

//         const daysSinceLast = lastSent
//             ? Math.floor(
//                 (today.getTime() - lastSent.getTime()) /
//                 (1000 * 60 * 60 * 24)
//             )
//             : Infinity;

//         // More than 5 days → every 2 days
//         if (daysLeft > 5) return daysSinceLast >= 2;

//         // 3–5 days → every 1 day
//         if (daysLeft <= 5 && daysLeft > 2) return daysSinceLast >= 1;

//         // last 2 days → daily (priority)
//         if (daysLeft <= 2 && daysLeft >= 0) return daysSinceLast >= 1;

//         // overdue → daily aggressive
//         if (daysLeft < 0) return daysSinceLast >= 1;

//         return false;
//     }

//     function generateReminderMessage(inv: Invoice) {
//         const count = inv.reminderCount || 0;

//         // 🎯 tone buckets
//         const tone1 = [
//             `Hi ${inv.client}, just a quick reminder that ₹${inv.amount} is due on ${inv.dueDate}.`,
//             `Hello ${inv.client}, your invoice of ₹${inv.amount} is due on ${inv.dueDate}.`,
//             `Hey ${inv.client}, this is a gentle reminder for ₹${inv.amount} due on ${inv.dueDate}.`,
//             `Hi ${inv.client}, just checking in — ₹${inv.amount} is due on ${inv.dueDate}.`,
//         ];

//         const tone2 = [
//             `Hi ${inv.client}, your payment of ₹${inv.amount} is still pending. Please process it.`,
//             `Hello ${inv.client}, just following up on the ₹${inv.amount} payment.`,
//             `Hey ${inv.client}, a reminder that ₹${inv.amount} is pending from your side.`,
//             `Hi ${inv.client}, requesting you to clear the ₹${inv.amount} payment soon.`,
//         ];

//         const tone3 = [
//             `Hi ${inv.client}, your payment of ₹${inv.amount} is overdue. Please clear it ASAP.`,
//             `Hello ${inv.client}, ₹${inv.amount} is now overdue. Kindly prioritize this.`,
//             `Hey ${inv.client}, this payment is overdue. Please take immediate action.`,
//             `Hi ${inv.client}, overdue reminder for ₹${inv.amount}. Looking forward to closure.`,
//         ];

//         const tone4 = [
//             `Final reminder: ₹${inv.amount} is pending. Immediate action required.`,
//             `Urgent: Please clear ₹${inv.amount} immediately to avoid further escalation.`,
//             `This is a final notice regarding ₹${inv.amount}. Kindly resolve today.`,
//         ];

//         // 🎯 pick random message
//         function pick(arr: string[]) {
//             return arr[Math.floor(Math.random() * arr.length)];
//         }

//         // 🎯 escalation logic
//         if (count === 0) return pick(tone1);
//         if (count === 1) return pick(tone2);
//         if (count === 2) return pick(tone3);
//         return pick(tone4);
//     }

//     return (
//         <main className="bg-[#F9FAFB] min-h-screen px-6 md:px-8 py-10">

//             {/* Header */}
//             <div className="max-w-5xl mx-auto">
//                 <h1 className="text-2xl md:text-3xl font-semibold text-[#111827]">
//                     Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-1 text-sm">
//                     Track invoices and payment reminders
//                 </p>
//             </div>

//             {/* Stats */}
//             <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-3 gap-6">

//                 <div className="bg-white p-6 rounded-2xl border border-gray-200">
//                     <p className="text-sm text-gray-500">Total Invoices</p>
//                     <p className="text-2xl font-semibold mt-2">{totalInvoices}</p>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl border border-gray-200">
//                     <p className="text-sm text-gray-500">Pending Payments</p>
//                     <p className="text-2xl font-semibold mt-2 text-yellow-600">{pending}</p>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl border border-gray-200">
//                     <p className="text-sm text-gray-500">Collected</p>
//                     <p className="text-2xl font-semibold mt-2 text-green-600">
//                         ₹{collected}
//                     </p>
//                 </div>

//             </div>

//             {/* Invoices Section */}
//             <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl border border-gray-200">

//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//                     <h2 className="text-lg font-semibold text-[#111827]">
//                         Recent Invoices
//                     </h2>

//                     <Link
//                         href="/dashboard/add-invoice"
//                         className="bg-[#111827] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
//                     >
//                         + Add Invoice
//                     </Link>
//                 </div>

//                 {/* Table */}
//                 <div className="hidden md:block overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead className="bg-gray-50 text-gray-600">
//                             <tr>
//                                 <th className="text-left px-6 py-3">Client</th>
//                                 <th className="text-left px-6 py-3">Amount</th>
//                                 <th className="text-left px-6 py-3">Due Date</th>
//                                 <th className="text-left px-6 py-3">Status</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-gray-200 text-gray-600">
//                             {invoices.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={4} className="text-center py-6 text-gray-400">
//                                         No invoices yet
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 invoices.map((inv) => {
//                                     const reminder = getReminderStatus(inv.dueDate);

//                                     return (
//                                         <tr key={inv.id}>
//                                             <td className="px-6 py-4">{inv.client}</td>
//                                             <td className="px-6 py-4">₹{inv.amount}</td>
//                                             <td className="px-6 py-4">{inv.dueDate}</td>

//                                             <td
//                                                 className={`px-6 py-4 ${inv.status === "Paid"
//                                                     ? "text-green-600"
//                                                     : reminder === "Overdue"
//                                                         ? "text-red-600"
//                                                         : reminder === "Due Today"
//                                                             ? "text-orange-600"
//                                                             : "text-yellow-600"
//                                                     }`}
//                                             >
//                                                 {inv.status === "Paid" ? "Paid" : reminder}
//                                             </td>

//                                             {/* 🔥 ADD THIS NEW TD */}
//                                             <td className="px-6 py-4">
//                                                 <button
//                                                     onClick={() => {
//                                                         let updated = [...invoices];
//                                                         const index = updated.findIndex(i => i.id === inv.id);

//                                                         updated[index] = {
//                                                             ...updated[index],
//                                                             remindersStarted: true,
//                                                             reminderCount: 0,
//                                                             lastReminderDate: null,
//                                                         };

//                                                         setInvoices(updated);
//                                                         localStorage.setItem("invoices", JSON.stringify(updated));

//                                                         alert("Auto reminders activated");
//                                                     }}
//                                                     className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
//                                                     disabled={inv.remindersStarted}
//                                                 >
//                                                     {inv.remindersStarted ? "Active" : "Start Reminders"}
//                                                 </button>
//                                             </td>

//                                             <td className="px-6 py-4">
//                                                 <button
//                                                     onClick={() => {
//                                                         const message = generateReminderMessage(inv);

//                                                         window.open(
//                                                             `https://wa.me/${inv.phone}?text=${encodeURIComponent(message)}`,
//                                                             "_blank"
//                                                         );
//                                                     }}
//                                                     className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
//                                                 >
//                                                     Send Now
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="md:hidden divide-y divide-gray-200">
//                     {invoices.length === 0 ? (
//                         <p className="text-center py-6 text-gray-400">No invoices yet</p>
//                     ) : (
//                         invoices.map((inv) => {
//                             const reminder = getReminderStatus(inv.dueDate);

//                             return (
//                                 <div key={inv.id} className="p-4">
//                                     <div className="flex justify-between items-center">
//                                         <p className="font-medium text-[#111827]">{inv.client}</p>
//                                         <span
//                                             className={`text-xs ${inv.status === "Paid"
//                                                 ? "text-green-600"
//                                                 : reminder === "Overdue"
//                                                     ? "text-red-600"
//                                                     : reminder === "Due Today"
//                                                         ? "text-orange-600"
//                                                         : "text-yellow-600"
//                                                 }`}
//                                         >
//                                             {inv.status === "Paid" ? "Paid" : reminder}
//                                         </span>
//                                     </div>

//                                     <p className="text-sm text-gray-600 mt-1">
//                                         ₹{inv.amount} • Due {inv.dueDate}
//                                     </p>
//                                     <div className="mt-3 flex gap-2">
//                                         <button
//                                             onClick={() => {
//                                                 let updated = [...invoices];
//                                                 const index = updated.findIndex(i => i.id === inv.id);

//                                                 updated[index] = {
//                                                     ...updated[index],
//                                                     remindersStarted: true,
//                                                     reminderCount: 0,
//                                                     lastReminderDate: null,
//                                                 };

//                                                 setInvoices(updated);
//                                                 localStorage.setItem("invoices", JSON.stringify(updated));
//                                             }}
//                                             className="flex-1 h-9 bg-blue-600 text-white rounded-lg text-xs flex items-center justify-center"
//                                             disabled={inv.remindersStarted}
//                                         >
//                                             {inv.remindersStarted ? "Active" : "Start"}
//                                         </button>

//                                         <button
//                                             onClick={() => {
//                                                 const message = generateReminderMessage(inv);

//                                                 window.open(
//                                                     `https://wa.me/${inv.phone}?text=${encodeURIComponent(message)}`,
//                                                     "_blank"
//                                                 );
//                                             }}
//                                             className="flex-1 h-9 bg-green-600 text-white rounded-lg text-xs flex items-center justify-center"
//                                         >
//                                             Send
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </div>

//         </main>
//     );
// }

"use client";
export const dynamic = "force-dynamic";


import Link from "next/link";
import { useEffect, useState } from "react";

type Invoice = {
    _id: string;
    client: string;
    phone: string;
    amount: number;
    dueDate: string;
    status: "paid" | "pending";
};

export default function Dashboard() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [success, setSuccess] = useState("");
    const [confirm, setConfirm] = useState<{
        type: "delete" | "paid" | null;
        invoice: Invoice | null;
    }>({ type: null, invoice: null });

    useEffect(() => {
        fetch("/api/invoices")
            .then(res => res.json())
            .then(data => setInvoices(data));
    }, []);

    // STATS
    const totalInvoices = invoices.length;
    const pending = invoices.filter(i => i.status === "pending").length;
    const collected = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

    function getReminderStatus(dueDate: string) {
        const today = new Date();
        const due = new Date(dueDate);

        // remove time difference
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        if (diff > 0) return "Upcoming";
        if (diff === 0) return "Due Today";
        return "Overdue";
    }

    function generateMessage(inv: Invoice) {
        return `Hi ${inv.client}, this is a reminder that ₹${inv.amount} is due on ${inv.dueDate}.`;
    }

    return (
        <>
            {confirm.type && confirm.invoice && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl">

                        <h2 className="text-lg font-semibold text-[#111827]">
                            {confirm.type === "delete" ? "Delete Invoice?" : "Mark as Paid?"}
                        </h2>

                        <p className="text-sm text-gray-600 mt-2">
                            {confirm.type === "delete"
                                ? "This action cannot be undone."
                                : "Are you sure you want to mark this invoice as paid?"}
                        </p>

                        <div className="flex justify-end gap-3 mt-5">

                            {/* CANCEL */}
                            <button
                                onClick={() => setConfirm({ type: null, invoice: null })}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            {/* CONFIRM */}
                            <button
                                onClick={async () => {
                                    if (!confirm.invoice) return;

                                    if (confirm.type === "delete") {
                                        await fetch("/api/invoices", {
                                            method: "DELETE",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ id: confirm.invoice._id })
                                        });

                                        setInvoices(prev => prev.filter(i => i._id !== confirm.invoice!._id));
                                        setSuccess("Invoice deleted");
                                    }

                                    if (confirm.type === "paid") {
                                        await fetch("/api/invoices", {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                id: confirm.invoice._id,
                                                status: "paid"
                                            })
                                        });

                                        setInvoices(prev =>
                                            prev.map(i =>
                                                i._id === confirm.invoice!._id ? { ...i, status: "paid" } : i
                                            )
                                        );
                                        setSuccess("Marked as paid");
                                    }

                                    setConfirm({ type: null, invoice: null });
                                    setTimeout(() => setSuccess(""), 2000);
                                }}
                                className="px-4 py-2 text-sm rounded-lg bg-black text-white"
                            >
                                Confirm
                            </button>

                        </div>
                    </div>
                </div>
            )}

            <main className="bg-[#F9FAFB] min-h-screen px-6 md:px-8 py-10">

                {/* Header */}
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#111827]">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Track invoices and payment reminders
                    </p>
                </div>

                {success && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                        {success}
                    </div>
                )}

                {/* Stats */}
                <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500">Total Invoices</p>
                        <p className="text-2xl font-semibold mt-2">{totalInvoices}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500">Pending Payments</p>
                        <p className="text-2xl font-semibold mt-2 text-yellow-600">{pending}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500">Collected</p>
                        <p className="text-2xl font-semibold mt-2 text-green-600">
                            ₹{collected}
                        </p>
                    </div>

                </div>

                {/* Invoices Section */}
                <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl border border-gray-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-[#111827]">
                            Recent Invoices
                        </h2>

                        <Link
                            href="/dashboard/add-invoice"
                            className="bg-[#111827] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                        >
                            + Add Invoice
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-6 py-3">Client</th>
                                    <th className="text-left px-6 py-3">Amount</th>
                                    <th className="text-left px-6 py-3">Due Date</th>
                                    <th className="text-left px-6 py-3">Status</th>
                                    <th className="text-left px-6 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-gray-600">
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10">
                                            <p className="text-gray-500 text-sm">No invoices yet</p>
                                            <Link
                                                href="/dashboard/add-invoice"
                                                className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                                            >
                                                Add your first invoice →
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((inv) => {
                                        const reminder = getReminderStatus(inv.dueDate);

                                        return (
                                            <tr key={inv._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">{inv.client}</td>
                                                <td className="px-6 py-4">₹{inv.amount}</td>
                                                <td className="px-6 py-4">{inv.dueDate}</td>

                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-medium ${inv.status === "paid"
                                                        ? "text-green-600"
                                                        : reminder === "Overdue"
                                                            ? "text-red-600"
                                                            : reminder === "Due Today"
                                                                ? "text-orange-600"
                                                                : "text-yellow-600"
                                                        }`}>
                                                        {inv.status === "paid" ? "Paid" : reminder}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 flex gap-2">

                                                    {/* SEND */}
                                                    <button
                                                        onClick={() => {
                                                            const message = generateMessage(inv);

                                                            window.open(
                                                                `https://wa.me/91${inv.phone}?text=${encodeURIComponent(message)}`,
                                                                "_blank"
                                                            );
                                                            setSuccess("Reminder opened in WhatsApp");
                                                            setTimeout(() => setSuccess(""), 2000);
                                                        }}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                                                        disabled={inv.status === "paid"}
                                                    >
                                                        Send
                                                    </button>

                                                    {/* MARK PAID */}
                                                    <button
                                                        onClick={() => {
                                                            setConfirm({ type: "paid", invoice: inv });
                                                        }}
                                                        className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs"
                                                    >
                                                        Paid
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        onClick={() => {
                                                            setConfirm({ type: "delete", invoice: inv });
                                                        }}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {invoices.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 text-sm">No invoices yet</p>
                                <Link
                                    href="/dashboard/add-invoice"
                                    className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                                >
                                    Add your first invoice →
                                </Link>
                            </div>
                        ) : (
                            invoices.map((inv) => {
                                const reminder = getReminderStatus(inv.dueDate);

                                return (
                                    <div key={inv._id} className="p-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-[#111827]">{inv.client}</p>
                                            <span className={`text-sm font-medium ${inv.status === "paid"
                                                ? "text-green-600"
                                                : reminder === "Overdue"
                                                    ? "text-red-600"
                                                    : reminder === "Due Today"
                                                        ? "text-orange-600"
                                                        : "text-yellow-600"
                                                }`}>
                                                {inv.status === "paid" ? "Paid" : reminder}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mt-1">
                                            ₹{inv.amount} • Due {inv.dueDate}
                                        </p>
                                        <div className="mt-3 flex gap-2">

                                            {/* SEND */}
                                            <button
                                                onClick={() => {
                                                    const message = generateMessage(inv);

                                                    window.open(
                                                        `https://wa.me/91${inv.phone}?text=${encodeURIComponent(message)}`,
                                                        "_blank"
                                                    );

                                                    setSuccess("Reminder opened in WhatsApp");
                                                    setTimeout(() => setSuccess(""), 2000);
                                                }}
                                                className="flex-1 h-9 bg-green-600 text-white rounded-lg text-xs flex items-center justify-center"
                                                disabled={inv.status === "paid"}
                                            >
                                                Send
                                            </button>

                                            {/* MARK PAID */}
                                            <button
                                                onClick={() => {
                                                    setConfirm({ type: "paid", invoice: inv });
                                                }}
                                                className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs"
                                            >
                                                Paid
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => {
                                                    setConfirm({ type: "delete", invoice: inv });
                                                }}
                                                className="flex-1 h-9 bg-red-600 text-white rounded-lg text-xs flex items-center justify-center"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </main>
        </>
    );
}



