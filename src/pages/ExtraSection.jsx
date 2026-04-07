import React from "react";

const ExtraSection = () => {
  return (
    <section className="py-12 text-yellow-50">
      <div className="container mx-auto px-4 space-y-12">

        {/* Why choose this gallery */}
        <div className="bg-gray-800/80 p-8 rounded-xl shadow-md text-center backdrop-blur-sm">
          <h2 className="text-3xl text-yellow-400 font-bold mb-4">Why Choose Our Gallery?</h2>
          <p className="text-gray-300">
            Discover unique artworks and support talented artists! Each piece tells a story and enriches your space.
          </p>
        </div>

        {/* Featured Artworks */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Featured Artworks 🎨</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            <div className="bg-gray-800/80 rounded-xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition-transform backdrop-blur-sm">
              <img src="https://i.ibb.co.com/7tkH8MZc/patrick-tomasso-QMDap1-TAu0g-unsplash.jpg" className="w-full h-48 object-cover rounded-lg mb-3" alt="Folk Art" />
              <h3 className="text-lg font-semibold mb-1">Folk Art</h3>
              <p className="text-yellow-300 font-medium">Price: $500</p>
            </div>

            <div className="bg-gray-800/80 rounded-xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition-transform backdrop-blur-sm">
              <img src="https://i.ibb.co.com/G4LnQk8b/frankie-cordoba-f-PYJe-Mm-YWM4-unsplash.jpg" className="w-full h-48 object-cover rounded-lg mb-3" alt="Sculptures" />
              <h3 className="text-lg font-semibold mb-1">Sculptures</h3>
              <p className="text-yellow-300 font-medium">Price: $750</p>
            </div>

            <div className="bg-gray-800/80 rounded-xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition-transform backdrop-blur-sm">
              <img src="https://i.ibb.co.com/zHPXMGTx/chris-czermak-Pam-FFHL6f-VY-unsplash.jpg" className="w-full h-48 object-cover rounded-lg mb-3" alt="Photography" />
              <h3 className="text-lg font-semibold mb-1">Photography</h3>
              <p className="text-yellow-300 font-medium">Price: $300</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ExtraSection;