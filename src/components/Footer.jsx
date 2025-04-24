import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Resume Builder */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Resume Builder</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Contact</Link></li>
                <li><Link to="#">Pricing</Link></li>
                <li><Link to="#">Reviews</Link></li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="#">Resume Examples</Link></li>
                <li><Link to="#">Cover Letter Examples</Link></li>
                <li><Link to="#">Career Blog</Link></li>
                <li><Link to="#">Resume Templates</Link></li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="#">Help Center</Link></li>
                <li><Link to="#">FAQ</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="#">AI Resume Writer</Link></li>
                <li><Link to="#">Resume Checker</Link></li>
                <li><Link to="#">Cover Letter Builder</Link></li>
                <li><Link to="#">Job Matching</Link></li>
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Follow Us</h3>
              <div className="flex gap-4 justify-center text-xl text-gray-400">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-sm text-gray-500  text-center">
          © {new Date().getFullYear()} Resume Builder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
