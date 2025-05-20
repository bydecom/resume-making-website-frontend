import React from 'react';

const Reviews = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      content: 'This resume builder is a game-changer! I was able to create a professional-looking resume in less than 30 minutes. The templates are modern and the AI suggestions were incredibly helpful.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      content: 'As someone in tech, I needed a resume that would stand out but still be ATS-friendly. This platform delivered exactly what I needed. Got three interview calls within a week!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Recent Graduate',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      content: 'I was struggling to create my first professional resume after college. The templates and guidance provided made it so simple. The ATS optimization feature is a huge plus!',
      rating: 4,
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Sales Director',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      content: 'The premium subscription is worth every penny. The ability to create multiple tailored resumes for different positions has been invaluable in my job search.',
      rating: 5,
    },
    {
      id: 5,
      name: 'Sophia Kim',
      role: 'Graphic Designer',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      content: 'As a designer, I was skeptical about using a template service, but I was pleasantly surprised by the customization options. The export quality is excellent!',
      rating: 4,
    },
    {
      id: 6,
      name: 'James Taylor',
      role: 'Project Manager',
      image: 'https://randomuser.me/api/portraits/men/6.jpg',
      content: "I've used several resume builders over the years, and this is by far the best. The interface is intuitive, and the AI suggestions are spot on. Highly recommend!",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Customer Reviews</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        See what our users are saying about their experience with our resume builder.
      </p>
      
      {/* Overall Rating */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2">Overall Rating</h2>
          <div className="flex items-center mb-2">
            {renderStars(4.8)}
            <span className="ml-2 text-xl font-bold">4.8/5</span>
          </div>
          <p className="text-gray-600">Based on 1,240+ reviews</p>
        </div>
      </div>
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
          >
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              {renderStars(testimonial.rating)}
            </div>
            
            <p className="text-gray-700 flex-grow">{testimonial.content}</p>
          </div>
        ))}
      </div>
      
      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to build your professional resume?</h2>
        <button className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default Reviews; 