
"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center 
  bg-gradient-to-r from-red-500 via-green-600 to-purple-600 shadow-md">
      <h1 className="text-2xl font-bold text-white">Photo Gallery</h1>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-white text-blue-600 
             hover:bg-blue-300 hover:rotate-12 hover:scale-110 hover:text-lg 
             transition-all duration-300"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 rounded-lg bg-white text-green-600 
             hover:bg-green-300 hover:-rotate-12 hover:scale-110 hover:text-lg 
             transition-all duration-300"
        >
          Signup
        </Link>


      </div>
    </nav>


  );
}
