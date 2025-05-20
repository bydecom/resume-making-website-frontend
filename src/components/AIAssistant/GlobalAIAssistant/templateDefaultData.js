/**
 * Default data for template previews
 */

export const defaultTemplateData = {
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    professionalHeadline: "Software Developer",
    email: "john.smith@example.com",
    phone: "+1 (123) 456-7890",
    location: "New York, NY",
    country: "USA",
    website: "johnsmith.dev",
    linkedin: "linkedin.com/in/johnsmith",
    github: "github.com/johnsmith"
  },
  summary: "Experienced software developer with over 5 years of experience in web development, specializing in React and Node.js. Passionate about creating efficient, scalable, and maintainable code with a focus on user experience.",
  experience: [
    {
      position: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "New York, NY",
      startDate: "2021-01-01",
      endDate: "",
      isPresent: true,
      description: "Lead the frontend development team in creating responsive web applications. Implemented modern React practices including hooks and context API. Reduced load time by 40% through code optimization."
    },
    {
      position: "Web Developer",
      company: "Digital Innovations",
      location: "Boston, MA",
      startDate: "2018-03-01",
      endDate: "2020-12-31",
      isPresent: false,
      description: "Developed and maintained multiple client websites using React, Redux, and TypeScript. Collaborated with UX designers to implement responsive designs. Integrated RESTful APIs for dynamic content."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology",
      location: "Boston, MA",
      startDate: "2014-09-01",
      endDate: "2018-05-31",
      isPresent: false,
      description: "Graduated with honors. Specialized in web technologies and software engineering."
    }
  ],
  skills: [
    "JavaScript (ES6+)",
    "React",
    "Node.js",
    "TypeScript",
    "HTML5/CSS3",
    "Redux",
    "RESTful APIs",
    "Git",
    "Agile/Scrum",
    "Responsive Design",
    "Testing (Jest, React Testing Library)"
  ],
  projects: [
    {
      title: "E-commerce Platform",
      role: "Lead Developer",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      isPresent: false,
      description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features like user authentication, product catalog, shopping cart, and payment processing.",
      link: "github.com/johnsmith/ecommerce-platform"
    },
    {
      title: "Task Management App",
      role: "Frontend Developer",
      startDate: "2021-07-01",
      endDate: "",
      isPresent: true,
      description: "Developed a task management application with drag-and-drop functionality using React and Firebase. Implemented real-time updates and offline capabilities.",
      link: "github.com/johnsmith/task-manager"
    }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Intermediate" }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2022-05-01"
    },
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2021-08-01"
    }
  ],
  template: {
    id: "professionalBlue"
  }
};

export default defaultTemplateData; 