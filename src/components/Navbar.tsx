
"use client";
import Link from "next/link";

export default function Navbar() {
return ( <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center"> <h1 className="text-2xl font-bold text-blue-600">Photo Gallery</h1>

  <div className="flex gap-4">
    <Link
      href="/login"
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Login
    </Link>

    <Link
      href="/signup"
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
    >
      Signup
    </Link>
  </div>
</nav>

);
}
