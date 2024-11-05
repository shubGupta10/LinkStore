import { NextResponse, NextRequest } from "next/server";
import LinkModel from "@/model/LinkModel";
import Connect from "@/dbConfig/Connect";

const validatePatchData = (data: any) => {
    const { linkId, ...patchData } = data;

    if (!linkId) {
        return { isValid: false, error: "Link ID is required" };
    }

    if (Object.keys(patchData).length === 0) {
        return { isValid: false, error: "No update data provided" };
    }

    return { isValid: true, linkId, patchData };
};

export async function PATCH(request: NextRequest) {
    try {
        await Connect();

        const data = await request.json();

        const validation = validatePatchData(data);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const { linkId, patchData } = validation;

        // Use findByIdAndUpdate for PATCH request to apply partial updates
        const response = await LinkModel.findByIdAndUpdate(
            linkId,
            { $set: patchData }, // Only update the fields provided in the request
            { new: true, runValidators: true }
        );

        if (!response) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Link patched successfully", data: response },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error patching link:", error);

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
