import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'templates', name: 'Templates' },
    { id: 'editing', name: 'Editing Your Resume' },
    { id: 'exporting', name: 'Exporting & Sharing' },
    { id: 'troubleshooting', name: 'Troubleshooting' },
  ];

  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpArticles = {
    'getting-started': [
      { id: 'gs1', title: 'How to create your first resume', link: '#' },
      { id: 'gs2', title: 'Choosing the right template', link: '#' },
      { id: 'gs3', title: 'Understanding AI resume assistance', link: '#' },
      { id: 'gs4', title: 'Resume building best practices', link: '#' },
    ],
    'account': [
      { id: 'ac1', title: 'How to create an account', link: '#' },
      { id: 'ac2', title: 'Managing your subscription', link: '#' },
      { id: 'ac3', title: 'Payment methods and billing', link: '#' },
      { id: 'ac4', title: 'Upgrading to premium', link: '#' },
    ],
    'templates': [
      { id: 't1', title: 'Available resume templates', link: '#' },
      { id: 't2', title: 'Customizing template colors', link: '#' },
      { id: 't3', title: 'Changing templates after creation', link: '#' },
      { id: 't4', title: 'Industry-specific template recommendations', link: '#' },
    ],
    'editing': [
      { id: 'ed1', title: 'Adding and removing sections', link: '#' },
      { id: 'ed2', title: 'Using the content editor', link: '#' },
      { id: 'ed3', title: 'Formatting text and styles', link: '#' },
      { id: 'ed4', title: 'Working with bullet points', link: '#' },
    ],
    'exporting': [
      { id: 'ex1', title: 'Downloading your resume as PDF', link: '#' },
      { id: 'ex2', title: 'Exporting to Word format', link: '#' },
      { id: 'ex3', title: 'Sharing your resume online', link: '#' },
      { id: 'ex4', title: 'Printing options and settings', link: '#' },
    ],
    'troubleshooting': [
      { id: 'tr1', title: 'Common formatting issues', link: '#' },
      { id: 'tr2', title: 'Resolving export problems', link: '#' },
      { id: 'tr3', title: 'Browser compatibility', link: '#' },
      { id: 'tr4', title: 'Contact support', link: '#' },
    ],
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = searchQuery 
    ? Object.values(helpArticles).flat().filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpArticles[activeCategory];

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Help Center</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Find answers to common questions and learn how to get the most out of Resume Builder.
      </p>
      
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category.id && !searchQuery
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Support */}
          <div className="bg-blue-50 rounded-lg shadow-md p-4 mt-4">
            <h3 className="font-semibold text-lg mb-2">Need more help?</h3>
            <p className="text-gray-700 mb-4">Our support team is ready to assist you with any questions.</p>
            <Link to="/contact" className="block text-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
        
        {/* Articles */}
        <div className="md:col-span-3">
          {searchQuery ? (
            <div>
              <h2 className="font-semibold text-xl mb-4">Search Results: {filteredArticles.length} articles found</h2>
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-700 mb-4">No articles found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={article.link}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-medium text-lg text-blue-600">{article.title}</h3>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-xl mb-4">{categories.find(cat => cat.id === activeCategory).name}</h2>
              <div className="grid grid-cols-1 gap-4">
                {helpArticles[activeCategory].map((article) => (
                  <Link
                    key={article.id}
                    to={article.link}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-medium text-lg text-blue-600">{article.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 