import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResumeExamples = () => {
  // Sample resume example data
  const resumeExamples = [
    {
      id: 1,
      title: 'Software Engineer Resume',
      category: 'tech',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Software+Engineer+Resume',
      downloadCount: 1892,
      featured: true,
    },
    {
      id: 2,
      title: 'Marketing Manager Resume',
      category: 'marketing',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Marketing+Manager+Resume',
      downloadCount: 1567,
      featured: true,
    },
    {
      id: 3,
      title: 'Graphic Designer Resume',
      category: 'creative',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Graphic+Designer+Resume',
      downloadCount: 1436,
      featured: false,
    },
    {
      id: 4,
      title: 'Project Manager Resume',
      category: 'management',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Project+Manager+Resume',
      downloadCount: 1289,
      featured: false,
    },
    {
      id: 5,
      title: 'Nurse Resume',
      category: 'healthcare',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Nurse+Resume',
      downloadCount: 1154,
      featured: false,
    },
    {
      id: 6,
      title: 'Sales Representative Resume',
      category: 'sales',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Sales+Representative+Resume',
      downloadCount: 1023,
      featured: false,
    },
    {
      id: 7,
      title: 'Teacher Resume',
      category: 'education',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Teacher+Resume',
      downloadCount: 987,
      featured: false,
    },
    {
      id: 8,
      title: 'Data Scientist Resume',
      category: 'tech',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Data+Scientist+Resume',
      downloadCount: 945,
      featured: true,
    },
    {
      id: 9,
      title: 'Customer Service Resume',
      category: 'customer-service',
      imageUrl: 'https://via.placeholder.com/800x1000?text=Customer+Service+Resume',
      downloadCount: 876,
      featured: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Examples' },
    { id: 'tech', name: 'Technology' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'creative', name: 'Creative' },
    { id: 'management', name: 'Management' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'sales', name: 'Sales' },
    { id: 'education', name: 'Education' },
    { id: 'customer-service', name: 'Customer Service' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter resume examples based on category and search term
  const filteredExamples = resumeExamples
    .filter(example => 
      (activeCategory === 'all' || example.category === activeCategory) &&
      example.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Professional Resume Examples</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Browse our collection of professional resume examples for various industries and job positions.
        Use these as inspiration to create your own standout resume.
      </p>
      
      {/* Search and Filter */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for resumes by job title..."
              value={searchTerm}
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
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Featured Examples */}
      {activeCategory === 'all' && !searchTerm && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Resume Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeExamples
              .filter(example => example.featured)
              .map((example) => (
                <div key={example.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden group">
                    <img 
                      src={example.imageUrl}
                      alt={example.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/resume-examples/${example.id}`}
                        className="bg-white text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-blue-50 transition"
                      >
                        View Example
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{example.title}</h3>
                    <p className="text-gray-500 text-sm">{example.downloadCount.toLocaleString()} downloads</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* All Examples */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          {searchTerm 
            ? `Search Results: ${filteredExamples.length} examples found` 
            : activeCategory !== 'all' 
              ? `${categories.find(cat => cat.id === activeCategory).name} Resume Examples` 
              : 'All Resume Examples'
          }
        </h2>
        
        {filteredExamples.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 mb-4">No resume examples found matching your search criteria.</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <div key={example.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden group">
                  <img 
                    src={example.imageUrl}
                    alt={example.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/resume-examples/${example.id}`}
                      className="bg-white text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-blue-50 transition"
                    >
                      View Example
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{example.title}</h3>
                  <p className="text-gray-500 text-sm">{example.downloadCount.toLocaleString()} downloads</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to create your own professional resume?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Choose from our professionally designed templates and customize it to match your style and experience.
        </p>
        <Link
          to="/templates"
          className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your Resume Now
        </Link>
      </div>
    </div>
  );
};

export default ResumeExamples; 