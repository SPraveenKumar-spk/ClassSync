import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-10 bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-2">ClassSync</h3>
            <p className="text-sm">
              Empowering education through collaboration
            </p>
          </div>

          <div className="flex  sm:flex-row gap-6 md:gap-12">
            <div>
              <h4 className="text-lg font-medium mb-2">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-sm text-center">
                <li>
                  <NavLink to="/" className="hover:text-blue-300">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="hover:text-blue-300">
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-blue-300">
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-medium mb-2">Connect</h4>
              <ul className="flex flex-col gap-2 text-sm ">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center md:text-right">
            <NavLink
              to="/login"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm"
            >
              Get Started
            </NavLink>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ClassSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
