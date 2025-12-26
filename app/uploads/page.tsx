"use client";

import Header from "@/components/Header";
import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, ImagePlus } from "lucide-react";

type UploadedImage = {
  url: string;
  key: string;
};

function ImageItem({
  img,
  onDelete,
}: {
  img: UploadedImage;
  onDelete: (key: string) => void;
}) {
  return (
    <li className="relative inline-block m-1 border border-gray-300 bg-white p-1 rounded">
      <img
        src={img.url}
        alt="Uploaded"
        className="block w-24 h-24 object-cover rounded"
      />
      <button
        onClick={() => onDelete(img.key)}
        className="absolute top-1 right-1 px-1 text-xs bg-gray-800 text-white rounded flex items-center gap-1"
      >
        <Trash2 size={12} /> Delete
      </button>
    </li>
  );
}

export default function Uploads() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const deleteImage = async (key: string) => {
    try {
      await fetch("/api/images/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      setImages((prev) => prev.filter((img) => img.key !== key));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleUploadComplete = async (res: UploadedImage[]) => {
    try {
      setImages((prev) => [...prev, ...res]);
      setLoading(false);

      await fetch("/api/images/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: res }),
      });

      toast.success("Upload completed");
    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white text-gray-900 px-4 py-10 font-sans">
        <section className="max-w-md mx-auto p-6 bg-white border rounded shadow">
          <header className="flex items-center mb-4 gap-2">
            <ImagePlus size={20} />
            <h1 className="text-lg font-semibold">Upload Images</h1>
          </header>

          <UploadDropzone
            endpoint="imageUploader"
            onUploadBegin={() => setLoading(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(err) => {
              toast.error(err.message);
              setLoading(false);
            }}
          />

          {loading && <p className="mt-3">Uploading images...</p>}

          {!loading && images.length === 0 && (
            <p className="mt-3">No images uploaded yet.</p>
          )}

          {images.length > 0 && (
            <ul className="flex flex-wrap mt-3">
              {images.map((img) => (
                <ImageItem key={img.key} img={img} onDelete={deleteImage} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
