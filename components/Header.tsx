"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, UploadIcon } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 text-gray-900 px-5 py-3 flex justify-between items-center font-sans shadow-sm">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-gray-900">
        Personal Drive
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4">
        <Link
          href="/uploads"
          className="flex items-center gap-1 text-gray-900 hover:text-gray-700"
        >
          <UploadIcon size={16} />
          Upload
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden text-gray-900 p-1"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          <Link
            href="/uploads"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <UploadIcon size={16} />
            Upload
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
