import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-400 text-black pt-14">
      <div className="w-11/12 mx-auto">
        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo & Description */}
          <div className="space-y-4 max-w-sm">
            <Link to="/" className="flex gap-2 items-center">
              <img className="h-[45px] w-[45px]" src={logo} alt="Logo" />
              <h1 className="text-2xl font-bold tracking-wide">ArtSphere</h1>
            </Link>
            <p className="text-sm text-white/90 leading-relaxed">
              ArtSphere showcases stunning artworks and connects art lovers with talented artists worldwide.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Useful Links</h4>
            <ul className="space-y-2 text-white/90">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-yellow-300 transition">Gallery</Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-yellow-300 transition">Artists</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-yellow-300 transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-white/90">
              <li>Email: support@artsphere.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Location: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <hr className="border-white/30 mt-10" />

        {/* Copyright */}
        <div className="text-center py-6 text-white/90 text-sm">
          © {new Date().getFullYear()} ArtSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;