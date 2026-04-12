import React from "react";

const ExtraSection = () => {
  return (
    <section className="py-16">

      <div className="w-11/12 mx-auto space-y-16">

        {/* 🔥 Why Choose Section */}
        <div className="text-center max-w-3xl mx-auto p-8 rounded-2xl backdrop-blur-md
          bg-white/80 border border-gray-200 shadow-lg
          dark:bg-gray-900 dark:border-gray-600">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our <span className="text-yellow-500">Gallery?</span>
          </h2>

          <p className="text-gray-600 dark:text-white text-sm md:text-base">
            Discover curated artworks from talented creators and bring meaningful art into your space.
          </p>
        </div>

        {/* 🔥 Featured Section */}
        <div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Featured <span className="text-yellow-500">Artworks</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105
              bg-white/80 border border-gray-200
              dark:bg-gray-900 dark:border-white/1">

              <img
                src="https://i.ibb.co.com/7tkH8MZc/patrick-tomasso-QMDap1-TAu0g-unsplash.jpg"
                alt="Folk Art"
                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Folk Art
                </h3>
                <p className="text-yellow-500 font-semibold mt-2">
                  Price: $500
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105
              bg-white/80 border border-gray-200
              dark:bg-gray-900 dark:border-white/1">

              <img
                src="https://i.ibb.co.com/G4LnQk8b/frankie-cordoba-f-PYJe-Mm-YWM4-unsplash.jpg"
                alt="Sculptures"
                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sculptures
                </h3>
                <p className="text-yellow-500 font-semibold mt-2">
                  Price: $750
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105
              bg-white/80 border border-gray-200
              dark:bg-gray-900 dark:border-white/1">

              <img
                src="https://i.ibb.co.com/zHPXMGTx/chris-czermak-Pam-FFHL6f-VY-unsplash.jpg"
                alt="Photography"
                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Photography
                </h3>
                <p className="text-yellow-500 font-semibold mt-2">
                  Price: $300
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ExtraSection;