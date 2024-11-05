import LinkModel from "@/model/LinkModel";
import Connect from "@/dbConfig/Connect";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await Connect();
        
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const links = await LinkModel.find({ userId }).sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            message: "Links fetched successfully",
            links
        });
    } catch (error) {
        console.error("Error fetching links:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching links" },
            { status: 500 }
        );
    }
}