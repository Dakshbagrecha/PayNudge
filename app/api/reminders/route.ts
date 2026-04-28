import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    const auth = req.headers.get("authorization");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");

    console.log("AUTH HEADER:", auth);
    console.log("QUERY SECRET:", querySecret);
    console.log("ENV SECRET:", process.env.CRON_SECRET);

    if (
        auth !== `Bearer ${process.env.CRON_SECRET}` &&
        querySecret !== process.env.CRON_SECRET
    ) {
        return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("PayNudge");

    const invoices = await db.collection("invoices").find({
        status: "pending"
    }).toArray();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = invoices.filter(inv => {
        const due = new Date(inv.dueDate);
        due.setHours(0, 0, 0, 0);

        return due <= today; // overdue OR today
    });

    console.log("REMINDERS TO SEND:", reminders.length);

    // For now just simulate sending
    reminders.forEach(inv => {
        const message = `Hi ${inv.client}, ₹${inv.amount} was due on ${inv.dueDate}. Please pay.`;

        console.log("SEND TO:", inv.phone);
        console.log("MESSAGE:", message);   
    });

    return NextResponse.json({ success: true, count: reminders.length });
}

