import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';

// Danh sách skill mẫu - bạn có thể mở rộng danh sách này
const SKILL_SUGGESTIONS = [
  "JavaScript", "Python", "Java", "C#", "C++", "Ruby", "Swift", "Kotlin", "Go", "Rust",
  "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js", "Ember.js", "Backbone.js",
  "Node.js", "Express.js", "NestJS", "Django", "Flask", "Spring Boot", "ASP.NET Core",
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "MariaDB", "OracleDB", "Redis", "Firebase",
  "GraphQL", "REST API", "SOAP", "gRPC", "WebSockets", "OAuth", "JWT", "OpenID Connect",
  "HTML", "CSS", "SASS", "LESS", "Bootstrap", "Tailwind CSS", "Material UI", "Chakra UI",
  "TypeScript", "CoffeeScript", "Bash Scripting", "PowerShell", "Shell Scripting",
  "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial", "CI/CD", "Jenkins", "TravisCI",
  "Docker", "Kubernetes", "Terraform", "Ansible", "Vagrant", "Helm", "CloudFormation",
  "AWS", "Azure", "Google Cloud Platform", "Firebase", "Heroku", "DigitalOcean",
  "Linux", "Windows Server", "Unix", "Ubuntu", "CentOS", "Debian", "Fedora",
  "Project Management", "Agile", "Scrum", "Kanban", "Lean", "Waterfall",
  "Team Leadership", "Stakeholder Management", "Risk Management", "Time Management",
  "Communication", "Problem Solving", "Critical Thinking", "Decision Making", "Conflict Resolution",
  "Adobe Photoshop", "Adobe Illustrator", "Adobe XD", "Figma", "Sketch", "InVision",
  "UI/UX Design", "Wireframing", "Prototyping", "User Research", "A/B Testing",
  "Digital Marketing", "SEO", "SEM", "Google Ads", "Facebook Ads", "Content Writing",
  "Copywriting", "Social Media Marketing", "Email Marketing", "Affiliate Marketing",
  "Data Analysis", "Data Visualization", "Excel", "Google Sheets", "Power BI", "Tableau",
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch",
  "OpenCV", "Pandas", "NumPy", "Scikit-Learn", "Keras", "Matplotlib", "Seaborn",
  "Cybersecurity", "Penetration Testing", "Network Security", "Ethical Hacking", "Cryptography",
  "Blockchain", "Smart Contracts", "Ethereum", "Solidity", "Hyperledger",
  "IoT", "Arduino", "Raspberry Pi", "Embedded Systems", "FPGA", "Microcontrollers",
  "Game Development", "Unity", "Unreal Engine", "Godot", "Cocos2d",
  "3D Modeling", "Blender", "Maya", "3ds Max", "ZBrush",
  "DevOps", "Site Reliability Engineering (SRE)", "Observability", "Monitoring", "Logging",
  "Business Analysis", "Market Research", "Competitive Analysis", "Customer Journey Mapping",
  "Legal Compliance", "GDPR", "HIPAA", "SOX Compliance", "ISO 27001",
  "Sales", "Negotiation", "CRM", "Customer Service", "B2B Sales", "B2C Sales",
  "E-commerce", "Shopify", "WooCommerce", "Magento", "Dropshipping",
  "Finance", "Accounting", "Taxation", "Budgeting", "Financial Modeling",
  "Human Resources", "Recruitment", "Employee Training", "Performance Management",
  "Public Speaking", "Presentation Skills", "Storytelling", "Brand Management",
  "Event Planning", "Fundraising", "Nonprofit Management", "Grant Writing",
  "Foreign Languages", "Translation", "Interpreting", "Teaching", "Coaching",
  "Video Editing", "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve",
  "Photography", "Photo Editing", "Lightroom", "Color Grading",
  "Music Production", "Audio Editing", "Ableton Live", "FL Studio", "Logic Pro X",
  "Virtual Reality", "Augmented Reality", "Metaverse Development", "3D Rendering",
  "Chatbot Development", "Conversational AI", "RPA (Robotic Process Automation)"
];


const SkillsStep = ({ data, updateData, nextStep, prevStep, formData }) => {
  // Extract skills from matchedSkills if available, otherwise use data directly
  const extractSkills = () => {
    // If data is already an array of strings, use it directly
    if (Array.isArray(data) && (data.length === 0 || typeof data[0] === 'string')) {
      return data || [];
    }
    
    // If formData has matchedSkills, extract skills from there
    if (formData?.matchedSkills?.length > 0) {
      return formData.matchedSkills.map(item => item.skill || '').filter(Boolean);
    }
    
    // Fallback to empty array
    return [];
  };
  
  const [skills, setSkills] = useState(extractSkills());
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const selectedItemRef = useRef(null);
  
  useEffect(() => {
    // Update skills when data changes
    setSkills(extractSkills());
    
    // Thêm event listener để đóng suggestions khi click ra ngoài
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [data, formData]);
  
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const suggestionsContainer = suggestionsRef.current;
      const selectedItem = suggestionsContainer.children[selectedIndex];
      
      if (selectedItem) {
        // Tính toán vị trí cần scroll đến
        const containerHeight = suggestionsContainer.clientHeight;
        const itemHeight = selectedItem.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + itemHeight;
        
        // Nếu item đang được chọn ở ngoài vùng nhìn thấy
        if (itemBottom > suggestionsContainer.scrollTop + containerHeight) {
          // Scroll xuống để hiển thị item
          suggestionsContainer.scrollTop = itemBottom - containerHeight;
        } else if (itemTop < suggestionsContainer.scrollTop) {
          // Scroll lên để hiển thị item
          suggestionsContainer.scrollTop = itemTop;
        }
      }
    }
  }, [selectedIndex]);
  
  useEffect(() => {
    if (formData?.matchedSkills?.length > 0) {
      console.log('Skills loaded from matchedSkills:', formData.matchedSkills);
    }
  }, [formData]);
  
  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleAddSkill();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      // Lọc các gợi ý phù hợp với input
      const filtered = SKILL_SUGGESTIONS.filter(
        skill => skill.toLowerCase().includes(value.toLowerCase()) &&
        !skills.some(existingSkill => 
          typeof existingSkill === 'string' 
            ? existingSkill.toLowerCase() === skill.toLowerCase()
            : existingSkill.skill.toLowerCase() === skill.toLowerCase()
        )
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (skill) => {
    // Check if skill already exists
    const skillExists = skills.some(existingSkill => 
      typeof existingSkill === 'string' 
        ? existingSkill.toLowerCase() === skill.toLowerCase()
        : existingSkill.skill.toLowerCase() === skill.toLowerCase()
    );
    
    if (!skillExists) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      updateData(updatedSkills);
    }
    setNewSkill('');
    setShowSuggestions(false);
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      // Check if skill already exists
      const skillExists = skills.some(existingSkill => 
        typeof existingSkill === 'string' 
          ? existingSkill.toLowerCase() === newSkill.trim().toLowerCase()
          : existingSkill.skill.toLowerCase() === newSkill.trim().toLowerCase()
      );
      
      if (!skillExists) {
        const updatedSkills = [...skills, newSkill.trim()];
        setSkills(updatedSkills);
        updateData(updatedSkills);
      }
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (index) => {
    const skillToRemove = skills[index];
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    updateData(updatedSkills);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add any pending skill before proceeding
    if (newSkill.trim() !== '') {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      updateData(updatedSkills);
    }
    
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add your skills
        </label>
        <div className="relative">
          <div className="flex">
            <input
              type="text"
              value={newSkill}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., JavaScript, Project Management, Photoshop"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-1" /> Add
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  ref={index === selectedIndex ? selectedItemRef : null}
                  className={`px-4 py-2 cursor-pointer ${
                    index === selectedIndex 
                      ? 'bg-gray-100' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Use ↑↓ arrows to navigate, Enter to select, or type custom skill
        </p>
      </div>
      
      {skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
              >
                <span className="text-sm">{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-gray-500 hover:text-red-600"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SkillsStep; 