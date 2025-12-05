
import ProtectedRoute from "@/src/components/ProtectedRoute";
import GalleryContent from "@/src/components/GalleryContent";

export default function GalleryPage() {
  return (
    <ProtectedRoute>
      <GalleryContent />
    </ProtectedRoute>
  );
}
