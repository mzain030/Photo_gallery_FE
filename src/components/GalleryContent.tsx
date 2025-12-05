"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGetUserQuery } from "../store/authApi";

type Photo = {
  id: number;
  url: string;
  name: string;
  category: string;
  isLocal?: boolean;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [perPage, setPerPage] = useState(12);
  const [query, setQuery] = useState("");
  const [categoryFilter] = useState("All");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: user } = useGetUserQuery();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Load previously uploaded images from localStorage
    const saved = localStorage.getItem("gallery_images");
    if (saved) setPhotos(JSON.parse(saved));
  }, []);

  // Save changes to localStorage
  const savePhotos = (list: Photo[]) => {
    localStorage.setItem("gallery_images", JSON.stringify(list));
    setPhotos(list);
  };

  // ===============================
  //  MULTIPLE IMAGE UPLOAD HANDLER
  // ===============================
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)
    );

    if (validImages.length === 0) {
      alert("Only image files are allowed!");
      return;
    }

    const newImages: Photo[] = validImages.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file.name,
      category: "Uploaded",
      isLocal: true,
    }));

    const updated = [...photos, ...newImages];
    savePhotos(updated);
  };

  // ===============================
  //  DELETE IMAGE
  // ===============================
  const deleteImage = (id: number) => {
    const updated = photos.filter((p) => p.id !== id);
    savePhotos(updated);
  };

  // ===============================
  // DOWNLOAD IMAGE
  // ===============================
  const downloadImage = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = photo.name;
    link.click();
  };

  // ===============================
  //  SEARCH LOGIC
  // ===============================
  const filteredPhotos = photos.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const visiblePhotos = filteredPhotos.slice(0, perPage);

  const currentFilteredIndex =
    selectedIndex === null
      ? null
      : filteredPhotos.findIndex(
          (p) => p.id === photos[selectedIndex]?.id
        );

  const openModalAtFilteredIndex = (filteredIndex: number) => {
    const globalId = filteredPhotos[filteredIndex]?.id;
    const globalIndex = photos.findIndex((p) => p.id === globalId);
    setSelectedIndex(globalIndex === -1 ? null : globalIndex);
    setIsZoomed(false);
  };

  const nextInFiltered = () => {
    if (currentFilteredIndex === null) return;
    openModalAtFilteredIndex(
      (currentFilteredIndex + 1) % filteredPhotos.length
    );
  };

  const prevInFiltered = () => {
    if (currentFilteredIndex === null) return;
    openModalAtFilteredIndex(
      (currentFilteredIndex - 1 + filteredPhotos.length) %
        filteredPhotos.length
    );
  };

  // ===============================
  //  If not logged in
  // ===============================
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          Login required
        </h1>
        <p className="text-lg">
          Please{" "}
          <a href="/login" className="underline text-blue-500">
            Log in
          </a>{" "}
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6 p-4 text-black bg-green-500">
        <h1 className="text-3xl font-bold text-sky-700">My Photo Gallery</h1>

        {/* Search */}<div>
        Search:{" "}<input
          type="search"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-black"
        />
        </div>

        {/* USER NAME */}
        <div className="font-semibold text-black">
          Welcome:{" "}
          <span className="text-sky-700">
            {user?.name || user?.email}
          </span>
        </div>

        {/* LOGOUT */}
        <Link
          href="/login"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </Link>
      </div>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {visiblePhotos.map((photo, i) => {
          const filteredIndex = filteredPhotos.findIndex(
            (p) => p.id === photo.id
          );

          return (
            <div
              key={photo.id}
              className="relative group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteImage(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md z-10 opacity-0 group-hover:opacity-100 transition"
              >
                ❌
              </button>

              {/* DOWNLOAD BUTTON */}
              <button
                onClick={() => downloadImage(photo)}
                className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md z-10 opacity-0 group-hover:opacity-100 transition"
              >
                ⬇
              </button>

              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-56 object-cover"
                onClick={() => openModalAtFilteredIndex(filteredIndex)}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center p-1">
                {photo.name}
              </div>
            </div>
          );
        })}

        {/* UPLOAD BOX */}
        <label className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-400 rounded-xl h-56 cursor-pointer hover:bg-gray-100">
          <span className="text-gray-600 font-semibold">
            Upload Images
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* LOAD MORE */}
      {perPage < filteredPhotos.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPerPage((p) => p + 12)}
            className="px-6 py-2 bg-sky-600 text-white rounded-md"
          >
            Load more
          </button>
        </div>
      )}

      {/* ====================== */}
      {/*  IMAGE MODAL VIEWER   */}
      {/* ====================== */}
      {selectedIndex !== null && photos[selectedIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            className="absolute left-4 text-3xl text-white"
            onClick={prevInFiltered}
          >
            ❮
          </button>

          <button
            className="absolute right-4 text-3xl text-white"
            onClick={nextInFiltered}
          >
            ❯
          </button>

          <div className="relative">
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 text-white text-3xl"
            >
              ✕
            </button>

            <img
              src={photos[selectedIndex].url}
              className={`max-h-[85vh] rounded-lg transition ${
                isZoomed ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
