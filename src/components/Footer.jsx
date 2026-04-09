import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-gray-800 dark:bg-gray-950 dark:text-gray-300 pt-16 pb-6">
      <div className="w-11/12 mx-auto">

        <div className="grid md:grid-cols-3 gap-12">

          {/* Logo & Description */}
          <div className="space-y-4 max-w-sm">
            <Link to="/" className="flex gap-3 items-center">
              <img className="h-[50px] w-[50px] object-contain" src={logo} alt="Logo" />
              <h1 className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">
                ArtSphere
              </h1>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Discover breathtaking artworks and connect with talented artists from around the world. 
              ArtSphere brings creativity and inspiration together in one place.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Useful Links
            </h4>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-indigo-500 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-indigo-500 transition duration-300">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-indigo-500 transition duration-300">
                  Artists
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-500 transition duration-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Contact
            </h4>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <span className="font-medium text-gray-800 dark:text-gray-200">Email:</span> support@artsphere.com
              </li>
              <li>
                <span className="font-medium text-gray-800 dark:text-gray-200">Phone:</span> +880 1234-567890
              </li>
              <li>
                <span className="font-medium text-gray-800 dark:text-gray-200">Location:</span> Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 dark:border-gray-700 mt-12" />

        {/* Copyright */}
        <div className="text-center pt-6 text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} ArtSphere. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;