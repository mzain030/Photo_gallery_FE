
import Navbar from "@/src/components/Navbar";

export default function Home() {
  return (
    <> 
    <Navbar />
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Photo Gallery</h1>
        <p className="text-lg text-gray-700 mb-8">
          Log in to view and manage your photos.
        </p>

        <div className="w-full h-96 overflow-x-auto flex gap-4 border rounded-lg p-4 shadow-lg">
          <img src="https://picsum.photos/id/1015/400/300" alt="Photo 1" className="h-full rounded" />
           <img src="https://picsum.photos/id/1016/400/300" alt="Photo 2" className="h-full rounded" /> 
           <img src="https://picsum.photos/id/1018/400/300" alt="Photo 3" className="h-full rounded" /> 
           <img src="https://picsum.photos/id/1020/400/300" alt="Photo 4" className="h-full rounded" /> 
           <img src="https://picsum.photos/id/1024/400/300" alt="Photo 5" className="h-full rounded" />
        </div>
      </div>
    </>


  );
}
