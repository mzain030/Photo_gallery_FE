"use client";


import { useGetPhotosQuery, useDeletePhotoMutation } from "../store/galleryApi";


export default function PhotoGrid() {
const { data, isLoading, isError } = useGetPhotosQuery();
const [deletePhoto] = useDeletePhotoMutation();


if (isLoading) return <div>Loading photos...</div>;
if (isError) return <div>Failed to load photos.</div>;


return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
{data?.results?.map((p: any) => (
<div key={p.id} className="border rounded overflow-hidden">
<img src={p.image_url || p.url} alt={p.title} className="w-full h-40 object-cover" />
<div className="p-2 flex justify-between items-center">
<div className="text-sm font-medium">{p.title ?? 'Untitled'}</div>
<div className="flex gap-2">
<button onClick={() => { /* navigate to edit UI */ }} className="text-sm px-2 py-1 border rounded">Edit</button>
<button onClick={() => deletePhoto(p.id)} className="text-sm px-2 py-1 border rounded">Delete</button>
</div>
</div>
</div>
))}
</div>
);
}