import { useQuery } from "@tanstack/react-query";
import ArtCard from "./ArtCard";

const SERVER = "http://localhost:3000";

const TrendingArts = () => {

  const { data: viewed = [] } = useQuery({
    queryKey: ["trendingViews"],
    queryFn: () =>
      fetch(`${SERVER}/trending/views`).then(res => res.json())
  });

  const { data: liked = [] } = useQuery({
    queryKey: ["trendingLikes"],
    queryFn: () =>
      fetch(`${SERVER}/trending/likes`).then(res => res.json())
  });

  const { data: rated = [] } = useQuery({
    queryKey: ["trendingRating"],
    queryFn: () =>
      fetch(`${SERVER}/trending/rating`).then(res => res.json())
  });

  return (

    <div className="space-y-12">

      {/* Most Viewed */}

      <section>

        <h2 className="text-2xl font-bold mb-4">
          🔥 Most Viewed Arts
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {viewed.map(art => (
            <ArtCard key={art._id} art={art} />
          ))}

        </div>

      </section>


      {/* Most Liked */}

      <section>

        <h2 className="text-2xl font-bold mb-4">
          ❤️ Most Liked Arts
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {liked.map(art => (
            <ArtCard key={art._id} art={art} />
          ))}

        </div>

      </section>


      {/* Top Rated */}

      <section>

        <h2 className="text-2xl font-bold mb-4">
          ⭐ Top Rated Arts
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {rated.map(art => (
            <ArtCard key={art._id} art={art} />
          ))}

        </div>

      </section>

    </div>

  );

};

export default TrendingArts;