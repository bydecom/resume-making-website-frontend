import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();
  
  // In a real application, you would fetch the blog post data based on the slug
  // For now, we will use a placeholder structure
  const post = {
    title: "Example Blog Post",
    date: "January 1, 2023",
    author: "Resume Builder Team",
    content: `
      <p>This is a placeholder for blog post content. In a real application, this would be fetched from a backend API based on the slug parameter.</p>
      <p>The slug for this post is: <strong>${slug}</strong></p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultrices tincidunt, nunc nisl aliquam nunc, eu aliquam nisl nunc eu nisl. Sed euismod, nisl vel ultrices tincidunt, nunc nisl aliquam nunc, eu aliquam nisl nunc eu nisl.</p>
      <h2>Career Advice</h2>
      <p>Sed euismod, nisl vel ultrices tincidunt, nunc nisl aliquam nunc, eu aliquam nisl nunc eu nisl. Sed euismod, nisl vel ultrices tincidunt, nunc nisl aliquam nunc, eu aliquam nisl nunc eu nisl.</p>
    `,
    category: "Career Advice",
    relatedPosts: [
      { id: 1, title: "10 Resume Mistakes to Avoid", slug: "resume-mistakes" },
      { id: 2, title: "How to Ace Your Job Interview", slug: "ace-job-interview" },
      { id: 3, title: "Building a Personal Brand", slug: "personal-brand" }
    ]
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8">
        <Link to="/career-blog" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-8">
          <span className="mr-4">{post.date}</span>
          <span className="mr-4">|</span>
          <span>By {post.author}</span>
          <span className="ml-auto bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            {post.category}
          </span>
        </div>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related Posts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {post.relatedPosts.map(relatedPost => (
            <div key={relatedPost.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-2">{relatedPost.title}</h3>
              <Link 
                to={`/blog/${relatedPost.slug}`}
                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
              >
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 