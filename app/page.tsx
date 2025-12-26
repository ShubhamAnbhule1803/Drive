"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { Trash2, Download, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ImageType {
  _id: string;
  url: string;
  key: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/images/get", { cache: "no-store" });
      const data = await res.json();

      if (data.images) {
        const map = new Map<string, ImageType>();
        data.images.forEach((img: ImageType) => map.set(img._id, img));
        setImages(Array.from(map.values()));
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const deleteImage = async (key: string) => {
    try {
      await fetch("/api/images/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      setImages((prev) => prev.filter((img) => img.key !== key));
      if (selectedImage?.key === key) setSelectedImage(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "auto";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedImage]);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Your Uploaded Images
        </h1>

        {!loading && images.length === 0 && (
          <p className="text-center text-gray-500">No images uploaded yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card
              key={img._id}
              className="cursor-pointer hover:shadow-lg group flex flex-col overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(img)}
            >
              <CardContent className="p-0">
                <img
                  src={img.url}
                  alt="Uploaded"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(img.key);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </CardFooter>
            </Card>
          ))}

          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-48 rounded-lg animate-pulse bg-gray-200"
              />
            ))}
        </div>
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={selectedImage.url}
                download
                className="bg-white hover:bg-gray-100 text-black px-3 py-1.5 rounded flex items-center gap-1 text-sm shadow"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm"
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
