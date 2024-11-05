import LinkModel from "@/model/LinkModel";
import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConfig/Connect";

export async function POST(request: NextRequest) {
    try {
        await Connect();
        
        const body = await request.json();
        
        const { linkName, actualLink, userId } = body;
        
        if (!linkName || !actualLink || !userId) {
            return NextResponse.json(
                { 
                    error: "All fields are required",
                    receivedData: { linkName, actualLink, userId }
                },
                { status: 400 }
            );
        }

        const linkData = {
            linkName,
            actualLink,
            userId
        };

        const links = new LinkModel(linkData);
        const savedLinks = await links.save();
        

        return NextResponse.json({
            message: "Link created successfully",
            status: true,
            linkId: savedLinks._id,
            savedLinks,
        });
    } catch (error: any) {
        console.error("Error creating link:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Error creating link",
                error: error.message 
            },
            { status: 500 }
        );
    }
}