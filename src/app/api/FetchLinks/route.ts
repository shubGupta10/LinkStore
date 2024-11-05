import LinkModel from "@/model/LinkModel";
import Connect from "@/dbConfig/Connect";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await Connect();
    try {
        const allLinks = await LinkModel.find();
        return NextResponse.json({
            message: "All links fetched successfully",
            status: true,
            allLinks,
        });
    } catch (error) {
        console.error("Error fetching links:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching links" },
            { status: 500 }
        );
    }
}
