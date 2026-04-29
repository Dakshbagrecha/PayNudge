// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function GET(req: Request) {
//     const auth = req.headers.get("authorization");
//     const url = new URL(req.url);
//     const querySecret = url.searchParams.get("secret");

//     console.log("AUTH HEADER:", auth);
//     console.log("QUERY SECRET:", querySecret);
//     console.log("ENV SECRET:", process.env.CRON_SECRET);

//     if (
//         auth !== `Bearer ${process.env.CRON_SECRET}` &&
//         querySecret !== process.env.CRON_SECRET
//     ) {
//         return new Response("Unauthorized", { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db("PayNudge");

//     const invoices = await db.collection("invoices").find({
//         status: "pending"
//     }).toArray();

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const reminders = invoices.filter(inv => {
//         const due = new Date(inv.dueDate);
//         due.setHours(0, 0, 0, 0);

//         return due <= today; // overdue OR today
//     });

//     console.log("REMINDERS TO SEND:", reminders.length);

//     // For now just simulate sending
//     reminders.forEach(inv => {
//         const message = `Hi ${inv.client}, ₹${inv.amount} was due on ${inv.dueDate}. Please pay.`;

//         console.log("SEND TO:", inv.phone);
//         console.log("MESSAGE:", message);   
//     });

//     return NextResponse.json({ success: true, count: reminders.length });
// }


import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    // 🔐 AUTH CHECK
    const auth = req.headers.get("authorization");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");

    if (
        auth !== `Bearer ${process.env.CRON_SECRET}` &&
        querySecret !== process.env.CRON_SECRET
    ) {
        return new Response("Unauthorized", { status: 401 });
    }

    // 📦 DB CONNECT
    const client = await clientPromise;
    const db = client.db("PayNudge");

    // 📅 TODAY (normalized)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 📥 FETCH ONLY VALID INVOICES
    const invoices = await db.collection("invoices").find({
        status: "pending",
        reminderEnabled: true
    }).toArray();

    let remindersSent = 0;

    // 🔁 PROCESS EACH INVOICE
    for (const inv of invoices) {
        const due = new Date(inv.dueDate);
        due.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
        );

        const stage = inv.reminderStage || 0;

        let shouldSend = false;
        let nextStage = stage;
        let message = "";

        // 🧠 STAGE LOGIC

        // Stage 0 → 2 days before due
        if (stage === 0) {
            if (diffDays <= -2) {
                // before due
                shouldSend = true;
                nextStage = 1;
                message = `Hi ${inv.client}, just a heads up — your payment of ₹${inv.amount} is due in 2 days.`;
            }
            else if (diffDays >= 0) {
                // already due or overdue → jump directly
                shouldSend = true;
                nextStage = 2;
                message = `Hi ${inv.client}, your payment of ₹${inv.amount} is due. Kindly process it.`;
            }
        }

        // Stage 1 → on due date
        else if (stage === 1 && diffDays === 0) {
            shouldSend = true;
            nextStage = 2;
            message = `Hi ${inv.client}, this is a reminder that ₹${inv.amount} is due today.`;
        }

        // Stage 2 → 2 days overdue
        else if (stage === 2 && diffDays >= 2) {
            shouldSend = true;
            nextStage = 3;
            message = `Hi ${inv.client}, your payment of ₹${inv.amount} is overdue by ${diffDays} days. Kindly process it.`;
        }

        // Stage 3 → 5 days overdue
        else if (stage === 3 && diffDays >= 5) {
            shouldSend = true;
            nextStage = 4;
            message = `Hi ${inv.client}, this is a follow-up regarding the pending ₹${inv.amount}. It is now ${diffDays} days overdue.`;
        }

        // Stage 4 → 10 days overdue (final)
        else if (stage === 4 && diffDays >= 10) {
            shouldSend = true;
            nextStage = 5;
            message = `Hi ${inv.client}, this is a final reminder for the pending ₹${inv.amount}, overdue by ${diffDays} days. Please take immediate action.`;
        }

        // 🚀 SEND + UPDATE
        if (shouldSend) {
            console.log("SEND TO:", inv.phone);
            console.log("MESSAGE:", message);

            await db.collection("invoices").updateOne(
                { _id: inv._id },
                {
                    $set: {
                        reminderStage: nextStage,
                        lastReminderSent: new Date()
                    },
                    $inc: {
                        reminderCount: 1
                    }
                }
            );

            remindersSent++;
        }
    }

    console.log("TOTAL REMINDERS SENT:", remindersSent);

    return NextResponse.json({
        success: true,
        sent: remindersSent
    });
}
