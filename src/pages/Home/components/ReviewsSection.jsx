import React from 'react';

const reviews = [
  {
    id: 1,
    title: 'This is the only resume ...',
    content: 'This is the only resume maker that has land me my dream job inerviews. Easy to navigate and very well put together.',
    author: 'Melga Pierce',
    date: 'about 5 hours ago'
  },
  {
    id: 2,
    title: 'I had an billing issue an...',
    content: 'I had an billing issue and their customer service was very good! They solved my problem, and for that they...',
    author: 'Miguel',
    date: '1 day ago'
  },
  {
    id: 3,
    title: 'Great experience to cre...',
    content: 'Great experience to create my cv by registering in this resume.io. I would highly recommend this site. Much...',
    author: 'DSV',
    date: '1 day ago'
  }
];

const ReviewsSection = () => {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2  className="text-3xl font-bold tracking-tighter mb-4 text-center text-gray-800">
        What Our Users <span className="text-blue-600">Say</span>
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
            <div className="text-blue-600 text-4xl mb-2">★★★★★</div>
            <div className="text-3xl font-bold mb-2">4.9 out of 5</div>
            <div className="text-xl font-semibold mb-2">From Community</div>
            <p className="text-base text-gray-600">based on 53,148 reviews</p>
          </div>

          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-blue-600 text-xl mb-2">★★★★★</div>
                <h3 className="text-xl font-bold mb-2">{review.title}</h3>
                <p className="text-base mb-4 text-gray-700">{review.content}</p>
                <p className="text-sm text-gray-500">{review.author} • {review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection; 