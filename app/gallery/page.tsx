"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Photo = {
    id: number;
    url: string;
    name: string;
    category: string;
    photographer?: string;
    date?: string;
    description?: string;
    isLocal?: boolean;
};

const INITIAL_PHOTOS: Photo[] = [
    { id: 1, url: "https://picsum.photos/id/1015/1200/800", name: "Mountain Peak", category: "Nature", photographer: "A. Khan", date: "2021-01-12", description: "Snow-capped mountain peak under a clear sky." },
    { id: 2, url: "https://picsum.photos/id/1016/1200/800", name: "Forest Path", category: "Nature", photographer: "B. Ali", date: "2020-05-05", description: "A serene path through dense forest." },
    { id: 3, url: "https://picsum.photos/id/1018/1200/800", name: "City Skyline", category: "Urban", photographer: "C. Raza", date: "2019-11-20", description: "Skyline of a bustling city at sunset." },
    { id: 4, url: "https://picsum.photos/id/1019/1200/800", name: "Desert Dunes", category: "Landscape", photographer: "D. Iqbal", date: "2021-03-18", description: "Golden sand dunes stretching to the horizon." },
    { id: 5, url: "https://picsum.photos/id/1020/1200/800", name: "Ocean Waves", category: "Seaside", photographer: "E. Javed", date: "2022-07-09", description: "Powerful waves crashing onto the shore." },
    { id: 6, url: "https://picsum.photos/id/1021/1200/800", name: "Autumn Leaves", category: "Nature", photographer: "F. Sana", date: "2020-10-14", description: "Trees with orange and red leaves in fall." },
    { id: 7, url: "https://picsum.photos/id/1022/1200/800", name: "Ancient Bridge", category: "Urban", photographer: "G. Malik", date: "2018-08-22", description: "Stone bridge over a calm river." },
    { id: 8, url: "https://picsum.photos/id/1023/1200/800", name: "Foggy Morning", category: "Nature", photographer: "H. Shah", date: "2021-12-01", description: "Morning fog covering a quiet meadow." },
    { id: 9, url: "https://picsum.photos/id/1024/1200/800", name: "City Lights", category: "Urban", photographer: "I. Ahmed", date: "2020-06-30", description: "City street illuminated at night." },
    { id: 10, url: "https://picsum.photos/id/1025/1200/800", name: "Blue Lake", category: "Landscape", photographer: "J. Iman", date: "2023-09-17", description: "Crystal blue lake surrounded by cliffs." },
    { id: 11, url: "https://picsum.photos/id/1026/1200/800", name: "Golden Sunset", category: "Seaside", photographer: "K. Yousaf", date: "2022-04-12", description: "Sunset over the calm sea." },
    { id: 12, url: "https://picsum.photos/id/1027/1200/800", name: "Cherry Blossoms", category: "Nature", photographer: "L. Farooq", date: "2021-03-25", description: "Pink cherry blossoms in full bloom." },
    { id: 13, url: "https://picsum.photos/id/1028/1200/800", name: "Ancient Ruins", category: "Urban", photographer: "M. Khalid", date: "2019-07-10", description: "Historic ruins in the middle of a desert." },
    { id: 14, url: "https://picsum.photos/id/1029/1200/800", name: "Snow Forest", category: "Nature", photographer: "N. Raza", date: "2020-12-05", description: "Evergreen forest covered in snow." },
    { id: 15, url: "https://picsum.photos/id/1030/1200/800", name: "Rocky Coast", category: "Seaside", photographer: "O. Ali", date: "2022-06-11", description: "Jagged rocks along the shoreline." },
    { id: 16, url: "https://picsum.photos/id/1031/1200/800", name: "Mountain Stream", category: "Nature", photographer: "P. Sana", date: "2021-08-19", description: "Clear mountain stream flowing through rocks." },
    { id: 17, url: "https://picsum.photos/id/1032/1200/800", name: "Urban Alley", category: "Urban", photographer: "Q. Ahmed", date: "2019-09-15", description: "Narrow alley in an old city district." },
    { id: 18, url: "https://picsum.photos/id/1033/1200/800", name: "Foggy Trees", category: "Nature", photographer: "R. Shah", date: "2021-03-05", description: "Trees blurred by morning fog." },
    { id: 19, url: "https://picsum.photos/id/1034/1200/800", name: "Sunflower Field", category: "Nature", photographer: "S. Iqbal", date: "2020-07-21", description: "Vast field of blooming sunflowers." },
    { id: 20, url: "https://picsum.photos/id/1035/1200/800", name: "City Bridge", category: "Urban", photographer: "T. Malik", date: "2021-02-17", description: "Modern bridge in the heart of the city." },
    { id: 21, url: "https://picsum.photos/id/1036/1200/800", name: "Desert Sunset", category: "Landscape", photographer: "U. Khan", date: "2020-05-03", description: "Sun setting behind desert dunes." },
    { id: 22, url: "https://picsum.photos/id/1037/1200/800", name: "Autumn Forest", category: "Nature", photographer: "V. Ali", date: "2021-10-30", description: "Forest trees in bright autumn colors." },
    { id: 23, url: "https://picsum.photos/id/1038/1200/800", name: "City Square", category: "Urban", photographer: "W. Raza", date: "2019-08-14", description: "Busy city square with fountains." },
    { id: 24, url: "https://picsum.photos/id/1039/1200/800", name: "Old Bridge", category: "Urban", photographer: "P. Ahmed", date: "2019-01-30", description: "Historic stone bridge over river." },
    { id: 25, url: "https://picsum.photos/id/1040/1200/800", name: "Flowers", category: "Nature", photographer: "F. Sana", date: "2022-02-14", description: "A field of colorful flowers." },
    { id: 26, url: "https://picsum.photos/id/1041/1200/800", name: "Rocky Mountains", category: "Landscape", photographer: "X. Malik", date: "2021-11-11", description: "Rock formations under cloudy skies." },
    { id: 27, url: "https://picsum.photos/id/1042/1200/800", name: "Sunset Boulevard", category: "Urban", photographer: "Y. Khan", date: "2020-06-25", description: "Street lit by the golden sunset." },
    { id: 28, url: "https://picsum.photos/id/1043/1200/800", name: "River Bend", category: "Landscape", photographer: "Z. Ali", date: "2021-04-08", description: "River winding through green hills." },
    { id: 29, url: "https://picsum.photos/id/1044/1200/800", name: "City Night", category: "Urban", photographer: "A. Farooq", date: "2019-12-21", description: "City skyline with lights reflecting on water." },
    { id: 30, url: "https://picsum.photos/id/1045/1200/800", name: "Forest Waterfall", category: "Nature", photographer: "B. Iqbal", date: "2022-08-19", description: "Waterfall in the middle of a dense forest." },
    { id: 31, url: "https://picsum.photos/id/1069/1200/800", name: "Beach Waves", category: "Seaside", photographer: "T. Aziz", date: "2021-05-27", description: "Waves crashing on the shore." },
    { id: 32, url: "https://picsum.photos/id/1050/1200/800", name: "Desert", category: "Landscape", photographer: "J. Malik", date: "2020-10-10", description: "Sand dunes and the horizon." },
    { id: 33, url: "https://picsum.photos/id/1040/1200/800", name: "Flowers", category: "Nature", photographer: "F. Sana", date: "2022-02-14", description: "A field of colorful flowers." },
    { id: 34, url: "https://picsum.photos/id/1039/1200/800", name: "Old Bridge", category: "Urban", photographer: "P. Ahmed", date: "2019-01-30", description: "Historic stone bridge over river." },
    { id: 35, url: "https://picsum.photos/id/1033/1200/800", name: "Foggy Trees", category: "Nature", photographer: "R. Shah", date: "2021-03-05", description: "Trees blurred by morning fog." },
    { id: 36, url: "https://picsum.photos/id/1025/1200/800", name: "Blue Lake", category: "Landscape", photographer: "K. Iman", date: "2023-09-17", description: "Crystal blue lake surrounded by cliffs." },
];

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [likes, setLikes] = useState<Record<number, boolean>>({});
    const [perPage, setPerPage] = useState(9);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isZoomed, setIsZoomed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem("gallery_likes");
        if (raw) setLikes(JSON.parse(raw));
    }, []);

    useEffect(() => {
        localStorage.setItem("gallery_likes", JSON.stringify(likes));
    }, [likes]);

    const filteredPhotos = photos.filter((p) => {
        if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            (p.photographer || "").toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q)
        );
    });

    const visiblePhotos = filteredPhotos.slice(0, perPage);

    const fmtDate = (d?: string) => {
        if (!d) return "Unknown";
        try { return new Date(d).toLocaleDateString(); } catch { return d; }
    };

    const currentFilteredIndex = selectedIndex === null ? null : filteredPhotos.findIndex((p) => p.id === photos[selectedIndex]?.id);
    const openModalAtFilteredIndex = (filteredIndex: number) => {
        const globalId = filteredPhotos[filteredIndex]?.id;
        const globalIndex = photos.findIndex((p) => p.id === globalId);
        setSelectedIndex(globalIndex === -1 ? null : globalIndex);
        setIsZoomed(false);
    };
    const nextInFiltered = () => { if (currentFilteredIndex === null) return; openModalAtFilteredIndex((currentFilteredIndex + 1) % filteredPhotos.length); };
    const prevInFiltered = () => { if (currentFilteredIndex === null) return; openModalAtFilteredIndex((currentFilteredIndex - 1 + filteredPhotos.length) % filteredPhotos.length); };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
            else if (e.key === "ArrowRight") nextInFiltered();
            else if (e.key === "ArrowLeft") prevInFiltered();
            else if (e.key === "+") setIsZoomed(true);
            else if (e.key === "-") setIsZoomed(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedIndex, filteredPhotos.length]);

    const downloadPhoto = (photo: Photo) => {
        const link = document.createElement("a");
        link.href = photo.url;
        link.download = `${photo.name.replace(/\s+/g, "_")}_${photo.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category)))];

    if (!isLoggedIn) {
        return (<div className="flex flex-col items-center justify-center h-screen text-center px-4"> <h1 className="text-3xl font-bold mb-4 text-red-600">
            Login required to view gallery images. </h1>
            <p className="text-lg text-gray-700">
                Please <a href="/login" className="text-blue-500 underline">log in</a> first. </p>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex text-black flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold text-sky-700">My Photo Gallery</h1>
                <div className="flex flex-wrap items-center gap-3">
                    Search:<input type="search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}
                        className="px-3 py-2 rounded-md text-black border border-blacks-300 focus:outline-none focus:ring focus:border-sky-300 w-64" />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)} </select>
                    <button onClick={() => { setQuery(""); setCategoryFilter("All"); }}
                        className="px-3 py-2 rounded-md border border-gray-300 text-sm">Reset</button> </div>

                <div className="flex justify-between items-center mb-6">
                    <Link href="/login" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Logout</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {visiblePhotos.map((photo) => {
                    const filteredIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                    return (
                        <div key={photo.id} className="relative group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transform transition hover:scale-[1.02] cursor-pointer">
                            <img src={photo.url} alt={photo.name} className="w-full h-56 object-cover" onClick={() => openModalAtFilteredIndex(filteredIndex)} />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center p-1 opacity-0 group-hover:opacity-100 transition">{photo.name}</div>
                        </div>
                    );
                })}
            </div>

            {perPage < filteredPhotos.length && (
                <div className="flex justify-center mt-6">
                    <button onClick={() => setPerPage((p) => p + 9)} className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Load more</button>
                </div>
            )}

            {selectedIndex !== null && photos[selectedIndex] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
                    <div className="absolute inset-0" onClick={() => { setSelectedIndex(null); setIsZoomed(false); }} />
                    <button onClick={prevInFiltered} className="absolute left-4 text-white text-3xl">❮</button>
                    <button onClick={nextInFiltered} className="absolute right-4 text-white text-3xl">❯</button>
                    <div className="relative max-w-5xl w-full mx-auto flex flex-col items-center">
                        <div className="absolute top-4 right-4 flex gap-3 items-center z-50">
                            <button onClick={() => { setSelectedIndex(null); setIsZoomed(false); }} className="text-white text-2xl p-2 rounded-md hover:bg-white/10">✕</button>
                            <button onClick={() => setIsZoomed((z) => !z)} className="text-white text-lg p-2 rounded-md hover:bg-white/10">{isZoomed ? "➖" : "➕"}</button>
                            <button onClick={() => downloadPhoto(photos[selectedIndex])} className="text-blue text-lg p-2 rounded-md hover:bg-white/10">⤓ DownLoad</button>
                        </div>
                        <div className={`bg-black rounded-lg overflow-hidden shadow-lg transform transition-all ${isZoomed ? "scale-[1.08]" : "scale-100"}`}>
                            <img src={photos[selectedIndex].url} alt={photos[selectedIndex].name} className="max-h-[80vh] w-full object-contain bg-black" />
                        </div>
                        <div className="mt-4 text-center text-white">
                            <div className="text-xl font-semibold">{photos[selectedIndex].name}</div>
                            <div className="text-sm text-gray-200">{photos[selectedIndex].photographer} • {fmtDate(photos[selectedIndex].date)}</div>
                            <div className="mt-2 max-w-3xl text-sm text-gray-200">{photos[selectedIndex].description}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
