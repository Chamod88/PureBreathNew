import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-24 lg:px-24 py-6 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/62907cab70a748747d05fe6a9c97f7ced018b1b7?width=236"
            alt="Logo"
            className="h-16 md:h-[118px] w-auto"
          />
        </Link>

        <nav className="flex items-center gap-6 md:gap-12">
          <Link
            to="/about"
            className="text-base md:text-2xl font-semibold text-black hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/login"
            className="text-base md:text-2xl font-semibold text-black hover:text-primary transition-colors"
          >
            Login
          </Link>
          <button
            className="flex-shrink-0"
            aria-label="Profile"
          >
            <svg
              className="w-8 h-8 md:w-[39px] md:h-[39px]"
              viewBox="0 0 39 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 11.375C13 9.65109 13.6848 7.99779 14.9038 6.77881C16.1228 5.55982 17.7761 4.875 19.5 4.875C21.2239 4.875 22.8772 5.55982 24.0962 6.77881C25.3152 7.99779 26 9.65109 26 11.375C26 13.0989 25.3152 14.7522 24.0962 15.9712C22.8772 17.1902 21.2239 17.875 19.5 17.875C17.7761 17.875 16.1228 17.1902 14.9038 15.9712C13.6848 14.7522 13 13.0989 13 11.375ZM13 21.125C10.8451 21.125 8.77849 21.981 7.25476 23.5048C5.73102 25.0285 4.875 27.0951 4.875 29.25C4.875 30.5429 5.38861 31.7829 6.30285 32.6971C7.21709 33.6114 8.45707 34.125 9.75 34.125H29.25C30.5429 34.125 31.7829 33.6114 32.6971 32.6971C33.6114 31.7829 34.125 30.5429 34.125 29.25C34.125 27.0951 33.269 25.0285 31.7452 23.5048C30.2215 21.981 28.1549 21.125 26 21.125H13Z"
                fill="black"
              />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
