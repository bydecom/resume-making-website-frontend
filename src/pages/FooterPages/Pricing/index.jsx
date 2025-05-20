import React from 'react';

const Pricing = () => {
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic resume templates',
        'Up to 1 resume',
        'Export to PDF',
        'Limited access to AI tools',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'monthly',
      features: [
        'All resume templates',
        'Unlimited resumes',
        'Export to PDF & Word',
        'Full access to AI tools',
        'Cover letter templates',
        'Resume analyzer',
      ],
      cta: 'Go Premium',
      popular: true,
    },
    {
      id: 'team',
      name: 'Business',
      price: '$49.99',
      period: 'monthly',
      features: [
        'Everything in Premium',
        'Up to 10 team members',
        'Team dashboard',
        'Priority support',
        'Branded templates',
        'Admin controls',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Pricing Plans</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Choose the perfect plan for your needs. Upgrade or downgrade at any time.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-white rounded-lg shadow-md overflow-hidden border ${
              plan.popular ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-3 py-1">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-2">/{plan.period}</span>
              </div>
              
              <hr className="my-6" />
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Can I cancel my subscription at any time?</h3>
            <p className="text-gray-700">Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing cycle.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Is there a discount for annual subscriptions?</h3>
            <p className="text-gray-700">Yes, we offer a 20% discount when you choose annual billing for any of our premium plans.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Do you offer refunds?</h3>
            <p className="text-gray-700">We offer a 14-day money-back guarantee if you\'re not satisfied with our service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 