import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("PayNudge");

    const invoices = await db.collection("invoices").find().toArray();

    return NextResponse.json(invoices);
}

export async function POST(req: Request) {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("PayNudge");

    const newInvoice = {
        ...body,
        status: "pending",
        dueDate: new Date(body.dueDate),

        reminderEnabled: true,
        reminderStage: 0,
        reminderCount: 0,
        lastReminderSent: null,

        createdAt: new Date(),
    };

    await db.collection("invoices").insertOne(newInvoice);

    return NextResponse.json(newInvoice);
}

export async function PUT(req: Request) {
    const { id, status } = await req.json();

    const client = await clientPromise;
    const db = client.db("PayNudge");

    let updateData: any = {
        status: status.toLowerCase()
    };

    if (status.toLowerCase() === "paid") {
        updateData.reminderEnabled = false;
    }

    const result = await db.collection("invoices").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return Response.json({ success: false, error: "Invoice not found" });
    }

    return Response.json({ success: true });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    console.log("DELETE REQUEST ID:", id);

    const client = await clientPromise;
    const db = client.db("PayNudge");

    const result = await db.collection("invoices").deleteOne({
        _id: new ObjectId(id)
    });

    console.log("DELETE RESULT:", result);

    if (result.deletedCount === 0) {
        return Response.json({ success: false, error: "Invoice not found" });
    }

    return Response.json({ success: true });
}
