import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("PayNudge");

    const invoices = await db.collection("Invoices").find().toArray();

    return NextResponse.json(invoices);
}

export async function POST(req: Request) {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("PayNudge");

    const newInvoice = {
        ...body,
        status: "Pending",
        createdAt: new Date(),
    };

    await db.collection("Invoices").insertOne(newInvoice);

    return NextResponse.json(newInvoice);
}

export async function PUT(req: Request) {
    const { id, status } = await req.json();

    console.log("PUT REQUEST ID:", id);
    console.log("PUT STATUS:", status);

    const client = await clientPromise;
    const db = client.db("PayNudge");

    const result = await db.collection("Invoices").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    );

    console.log("PUT RESULT:", result);

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

    const result = await db.collection("Invoices").deleteOne({
        _id: new ObjectId(id)
    });

    console.log("DELETE RESULT:", result);

    if (result.deletedCount === 0) {
        return Response.json({ success: false, error: "Invoice not found" });
    }

    return Response.json({ success: true });
}
