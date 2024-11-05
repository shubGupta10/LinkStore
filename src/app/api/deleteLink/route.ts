import LinkModel from "@/model/LinkModel";
import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConfig/Connect";

export async function DELETE(request: NextRequest) {
    await Connect();
    
    try {
        const data = await request.json();
        const { linkId } = data;
        
        if (!linkId) {
            return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
        }

        const response = await LinkModel.findByIdAndDelete(linkId);

        if (!response) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Link deleted successfully", data: response },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting link:", error);
        return NextResponse.json(
            { error: "Failed to delete link" },
            { status: 500 }
        );
    }
}