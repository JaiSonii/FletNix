"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getShowDetails, getRecommendations } from '@/lib/api';
import { ShowDetail, Show } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState<ShowDetail | null>(null);
  const [recommendations, setRecommendations] = useState<Show[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      try {
        const { data } = await getShowDetails(id as string);
        console.log(data)
        setShow(data);
        setRecommendations(data?.recommendations);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("You are too young to view this content (Rated R).");
        } else {
          setError("Failed to load details.");
        }
      }
    };
    fetchAll();
  }, [id]);

  if (error) return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-red-500 text-2xl font-bold">{error}</div>
    </div>
  );

  if (!show) return <div className="min-h-screen bg-[#141414] text-white"><Navbar /><div className="p-10">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="container mx-auto p-6 max-w-6xl">

        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 animate-in fade-in duration-500">
          <div className="w-full md:w-1/3 aspect-[2/3] bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-gray-700 to-black p-4 text-center">
            {show.title}
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">{show.title}</h1>
            <div className="flex flex-wrap gap-4 items-center text-gray-400 text-lg">
              <span>{show.release_year}</span>
              <Badge variant="secondary" className="bg-gray-700 text-white text-md px-3 py-1">{show.rating}</Badge>
              <span>{show.duration}</span>
              <Badge variant="outline" className="border-gray-500 text-gray-400">{show.type}</Badge>
            </div>
            <p className="text-xl leading-relaxed text-gray-300">{show.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm text-gray-400">
              <div className="border-l-2 border-netflixRed pl-4">
                <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Starring</span>
                {show.cast || "N/A"}
              </div>
              <div className="border-l-2 border-netflixRed pl-4">
                <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Director</span>
                {show.director || "N/A"}
              </div>
              <div className="col-span-2 border-l-2 border-netflixRed pl-4">
                <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Genres</span>
                {show.listed_in}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 my-10" />

        {/* Reviews */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Reviews</h2>
          {show.reviews && show.reviews.length > 0 ? (
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800">
              {/* Display the main IMDb rating if available (sent separately by backend) */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-yellow-500 text-4xl font-bold">
                  ★ {show.imdb_rating || "N/A"}
                </span>
                <span className="text-gray-500 text-lg">IMDb Score</span>
              </div>

              {/* Map over the reviews array */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {show.reviews.map((review, i) => (
                  <div key={i} className="bg-black/50 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                    <span className="font-semibold text-gray-300">
                      {review.source}
                    </span>
                    <span className="text-white font-bold bg-netflixRed px-2 py-1 rounded text-sm">
                      {review.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No external reviews available.</p>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-3xl font-bold mb-6">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map(rec => (
              <Link href={`/show/${rec.show_id}`} key={rec.show_id} className="block bg-[#1a1a1a] p-4 rounded-lg hover:bg-[#252525] transition hover:-translate-y-1">
                <h4 className="font-bold truncate text-sm">{rec.title}</h4>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{rec.release_year}</span>
                  <span>{rec.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}