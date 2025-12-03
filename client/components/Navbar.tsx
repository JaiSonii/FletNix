"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50 shadow-md border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-netflixRed tracking-tighter cursor-pointer">
          FLETNIX
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-gray-300">
          Sign Out
        </Button>
      </div>
    </nav>
  );
}