import { useQuery } from "@tanstack/react-query";
import ArtCard from "./ArtCard";

const SERVER = "http://localhost:3000";

const TrendingArts = () => {
  const {
    data: allArts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allListings"],
    queryFn: async () => {
      const res = await fetch(`${SERVER}/listing`);
      const data = await res.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading Trending Arts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        Failed to load trending arts
      </div>
    );
  }

  // ==========================
  // Compute trending scores
  // ==========================
  const trending = [...allArts]
    .map((art) => ({
      ...art,
      trendingScore: (art.views || 0) * 0.5 + (art.likes || 0) * 0.3 + (art.rating || 0) * 0.2,
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 6);

  const sortedByViews = [...allArts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const sortedByLikes = [...allArts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 6);

  const sortedByRating = [...allArts]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // ==========================
  // Deduplicate Arts for Display
  // Ensures same art doesn't appear twice
  // ==========================
  const uniqueArtsById = (arr) => Array.from(new Map(arr.map(a => [a._id, a])).values());

  return (
    <div className="space-y-14">

      {/* Overall Trending */}
      <section>
        <h2 className="text-2xl font-bold mb-6">🔥 Top Trending Arts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {uniqueArtsById(trending).map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>
      </section>

      {/* Most Viewed */}
      <section>
        <h2 className="text-2xl font-bold mb-6">👁 Most Viewed Arts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {uniqueArtsById(sortedByViews).map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>
      </section>

      {/* Most Liked */}
      <section>
        <h2 className="text-2xl font-bold mb-6">❤️ Most Liked Arts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {uniqueArtsById(sortedByLikes).map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section>
        <h2 className="text-2xl font-bold mb-6">⭐ Top Rated Arts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {uniqueArtsById(sortedByRating).map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default TrendingArts;