import { NextResponse, NextRequest } from "next/server";
import LinkModel from "@/model/LinkModel";
import Connect from "@/dbConfig/Connect";

const validateUpdateData = (data: any) => {
    const { linkId, ...updateData } = data;
    
    if (!linkId) {
        return { isValid: false, error: "Link ID is required" };
    }
    
    if (Object.keys(updateData).length === 0) {
        return { isValid: false, error: "No update data provided" };
    }
    
    return { isValid: true, linkId, updateData };
};

export async function PATCH(request: NextRequest) {
    try {
        await Connect();

        const data = await request.json();
        
        const validation = validateUpdateData(data);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const { linkId, updateData } = validation;

        const response = await LinkModel.findByIdAndUpdate(
            linkId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!response) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Link updated successfully", data: response },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating link:", error);
        
        if (error.name === "ValidationError") {
            return NextResponse.json(
                { error: "Invalid data provided", details: error.errors },
                { status: 400 }
            );
        }
        
        if (error.name === "CastError") {
            return NextResponse.json(
                { error: "Invalid link ID format" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    return UPDATE(request);
}