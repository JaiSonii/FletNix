"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getShows } from '@/lib/api';
import { Show } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getShows(page, typeFilter, search);
      console.log(data)
      setShows(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchData();
    }, 300); // Simple debounce
    return () => clearTimeout(timer);
  }, [page, typeFilter, search]);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <main className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <Input 
            placeholder="Search titles or cast..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-black border-gray-700 text-white w-full md:w-1/3"
          />

          <Select onValueChange={(val) => { setTypeFilter(val); setPage(1); }}>
            <SelectTrigger className="w-[180px] bg-black border-gray-700 text-white">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Movie">Movies</SelectItem>
              <SelectItem value="TV Show">TV Shows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && shows.length === 0 ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading content...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {shows.map((show) => (
              <Link href={`/show/${show.show_id}`} key={show.show_id} className="group">
                <div className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                   <div className="h-full flex flex-col justify-center items-center p-4 text-center bg-gradient-to-b from-gray-800 to-black">
                      <h3 className="font-bold text-lg line-clamp-2">{show.title}</h3>
                      <div className="mt-3 flex gap-2">
                          <Badge variant="outline" className="text-gray-400 border-gray-600">{show.rating}</Badge>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{show.release_year}</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-12 mb-10">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="bg-black text-white border-gray-700"
          >
            Previous
          </Button>
          <span className="flex items-center text-gray-400">Page {page} of {totalPages}</span>
          <Button 
            variant="outline" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="bg-black text-white border-gray-700"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}