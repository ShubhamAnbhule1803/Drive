import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Image } from "@/models/image";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json();
    console.log(key)

    if (!key) {
      return NextResponse.json(
        { error: "Image key is required" },
        { status: 400 }
      );
    }

    await connectDB();

    console.log(key)

    // Delete from UploadThing
    await utapi.deleteFiles(key);

    // Delete from MongoDB
    await Image.deleteOne({ key });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
