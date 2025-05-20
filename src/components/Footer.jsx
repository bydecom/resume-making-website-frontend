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
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/reviews">Reviews</Link></li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/resume-examples">Resume Examples</Link></li>
                <li><Link to="/cover-letter-examples">Cover Letter Examples</Link></li>
                <li><Link to="/career-blog">Career Blog</Link></li>
                <li><Link to="/templates">Resume Templates</Link></li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/help-center">Help Center</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col items-center justify-start">
            <div>
              <h3 className="mb-4 text-lg font-bold">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/ai-resume-writer">AI Resume Writer</Link></li>
                <li><Link to="/resume-checker">Resume Checker</Link></li>
                <li><Link to="/cover-letter-builder">Cover Letter Builder</Link></li>
                <li><Link to="/job-matching">Job Matching</Link></li>
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
