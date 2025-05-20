import React from 'react';
import { Link } from 'react-router-dom';

const CareerBlog = () => {
  // Sample blog post data - in a real app, this would come from an API
  const blogPosts = [
    {
      id: 1,
      title: "10 Resume Mistakes to Avoid in 2023",
      excerpt: "Learn about the common resume mistakes that could be costing you interviews and how to fix them.",
      category: "Resume Tips",
      date: "June 15, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Resume+Tips",
      slug: "resume-mistakes-to-avoid"
    },
    {
      id: 2,
      title: "How to Answer the 'Tell Me About Yourself' Question",
      excerpt: "Master the most common interview question with our proven framework and example answers.",
      category: "Interview Tips",
      date: "July 21, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Interview+Tips",
      slug: "tell-me-about-yourself"
    },
    {
      id: 3,
      title: "The Power of Networking in Your Job Search",
      excerpt: "Discover how to leverage your professional network to uncover hidden job opportunities.",
      category: "Job Search",
      date: "August 3, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Job+Search",
      slug: "power-of-networking"
    },
    {
      id: 4,
      title: "Remote Work Skills Every Professional Should Have",
      excerpt: "Develop these essential skills to thrive in the growing remote work environment.",
      category: "Career Development",
      date: "September 12, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Remote+Work",
      slug: "remote-work-skills"
    },
    {
      id: 5,
      title: "How to Write a Cover Letter That Gets Noticed",
      excerpt: "Stand out from the competition with these proven cover letter strategies and templates.",
      category: "Cover Letters",
      date: "October 5, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Cover+Letters",
      slug: "effective-cover-letters"
    },
    {
      id: 6,
      title: "Salary Negotiation Techniques for Every Career Stage",
      excerpt: "Learn how to confidently negotiate your salary whether you\'re just starting or are a seasoned professional.",
      category: "Career Advice",
      date: "November 18, 2023",
      image: "https://placehold.co/600x400/e4e8f0/2563eb?text=Salary+Tips",
      slug: "salary-negotiation"
    }
  ];

  // Featured categories
  const categories = [
    "Resume Tips",
    "Cover Letters",
    "Interview Prep",
    "Job Search",
    "Career Development",
    "Workplace Skills"
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Career Blog</h1>
      <p className="text-gray-600 text-center mb-12">Insights and advice to power your career journey</p>
      
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category, index) => (
          <button 
            key={index}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-sm font-medium transition duration-300"
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Featured Post */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="https://placehold.co/800x600/e4e8f0/2563eb?text=Featured+Post" 
              alt="Featured post" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="text-blue-600 font-medium mb-2">Featured Article</div>
            <h2 className="text-2xl font-bold mb-4">Ultimate Guide to Resume Writing in 2023</h2>
            <p className="text-gray-700 mb-6">
              Everything you need to know about crafting a resume that gets past ATS systems and impresses 
              hiring managers in today's competitive job market.
            </p>
            <Link 
              to="/blog/ultimate-resume-guide" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md 
              transition duration-300 w-fit"
            >
              Read Article
            </Link>
          </div>
        </div>
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <img 
              src={post.image} 
              alt={post.title} 
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">{post.category}</span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4 flex-grow">{post.excerpt}</p>
              <Link 
                to={`/blog/${post.slug}`} 
                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-blue-50 rounded-lg p-8 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get Career Advice Delivered to Your Inbox</h2>
          <p className="text-gray-700 mb-6">
            Join our newsletter for the latest career tips, industry insights, and job search strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md 
              transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerBlog; 