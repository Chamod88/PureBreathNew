import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-[#E9EDF0]">
        <div className="text-center px-6">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-8 py-4 rounded-[43px] text-lg md:text-2xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
