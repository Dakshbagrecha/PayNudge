"use client";
import { useState } from "react";

export default function DashboardPreview() {
    const [remindersSent, setRemindersSent] = useState(false);
    return (
        <div id="demo" className="scroll-mt-24 bg-white/90 border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-700">Recent Invoices</p>
                <span className="text-xs text-gray-500">Demo</span>
            </div>

            <div className="mb-4 text-xs text-green-700 bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg">
                +₹18,XXX collected faster using reminders.
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <div className="grid grid-cols-4 text-xs text-gray-500 mb-2 px-2">
                    <p>Client</p>
                    <p>Amount</p>
                    <p>Due</p>
                    <p>Status</p>
                </div>

                <div className="space-y-2">
                    {[
                        { name: "Ravi Traders", amount: "₹12,XXXX", due: "Aug 20", status: "Upcoming" },
                        { name: "Mehta & Co.", amount: "₹8,XXX", due: "Today", status: "Due Today" },
                        { name: "Sharma Textiles", amount: "₹1,5X,XXX", due: "Apr 2", status: "Overdue" },
                    ].map((item, i) => (
                        <div key={i} className={`grid grid-cols-4 items-start text-sm p-2 rounded-lg ${item.status === "Overdue"
                            ? "bg-red-50 border border-red-100"
                            : "bg-gray-50"
                            }`}>
                            <div>
                                <p>{item.name}</p>
                                {(item.status !== "Upcoming" || (remindersSent && item.name === "Ravi Traders")) && (
                                    <span className="inline-block mt-1 text-[10px] bg-blue-50 text-blue-600 py-0.5 rounded">
                                        Reminder sent
                                    </span>
                                )}
                            </div>
                            <p>{item.amount}</p>
                            <p>{item.due}</p>
                            <div className="flex items-center gap-2">
                                <p
                                    className={
                                        item.status === "Overdue"
                                            ? "text-red-600"
                                            : item.status === "Due Today"
                                                ? "text-orange-600"
                                                : "text-yellow-600"
                                    }
                                >
                                    {item.status}
                                </p>

                                {item.status === "Upcoming" && !(remindersSent && item.name === "Ravi Traders") && (
                                    <button
                                        onClick={() => setRemindersSent(true)}
                                        className="text-[10px] bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                                    >
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {[
                    { name: "Ravi Traders", amount: "₹12,XXXX", due: "Aug 20", status: "Upcoming" },
                    { name: "Mehta & Co.", amount: "₹8,XXX", due: "Today", status: "Due Today" },
                    { name: "Sharma Textiles", amount: "₹1,5X,XXX", due: "Apr 2", status: "Overdue" },
                ].map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                {(item.status !== "Upcoming" || (remindersSent && item.name === "Ravi Traders")) && (
                                    <span className="inline-block mt-1 text-[10px] bg-blue-50 text-blue-600  py-0.5 rounded">
                                        Sent
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs ${item.status === "Overdue"
                                        ? "text-red-600"
                                        : item.status === "Due Today"
                                            ? "text-orange-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {item.status}
                                </span>

                                {item.status === "Upcoming" && !(remindersSent && item.name === "Ravi Traders") && (
                                    <button
                                        onClick={() => setRemindersSent(true)}
                                        className="text-[10px] bg-green-600 text-white px-2 py-1 rounded"
                                    >
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                            {item.amount} • Due {item.due}
                        </p>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
                Start sending reminders in 30 seconds →
            </p>
        </div>
    );
}