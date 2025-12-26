import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Image } from "@/models/image";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { images } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const savedImages = await Image.insertMany(
      images.map((img) => ({
        url: img.url,
        key: img.key,
        user: user._id,
      }))
    );

    console.log(savedImages);

    return NextResponse.json(
      { message: "Images saved successfully", images: savedImages },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving images:", error);
    return NextResponse.json(
      { error: "Failed to save images" },
      { status: 500 }
    );
  }
}
