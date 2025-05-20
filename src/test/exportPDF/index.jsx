import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import MinimalistTemplate from './template';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Đảm bảo import FontAwesome

// Component bao bọc để xuất PDF
const PDFExporter = ({ formData }) => {
  const templateRef = useRef(null);

  // Hàm xuất PDF
  const exportToPDF = async () => {
    if (!templateRef.current) return;

    try {
      // Thông báo đang bắt đầu xuất PDF
      console.log('Starting PDF export...');
      
      // Thiết lập kích thước và độ phân giải cho PDF
      const scale = 2; // Tăng độ phân giải
      const options = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: true,
        height: templateRef.current.scrollHeight,
        width: templateRef.current.scrollWidth
      };

      // Tạo canvas từ template React
      const canvas = await html2canvas(templateRef.current, options);
      
      // Tính toán kích thước PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Tạo file PDF mới với định dạng A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Xác định số trang cần thiết
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        position, 
        imgWidth, 
        imgHeight, 
        undefined, 
        'FAST'
      );
      
      heightLeft -= pageHeight;
      
      // Nếu nội dung vượt quá 1 trang, tạo thêm các trang mới
      while (heightLeft > 0) {
        position = -(pageNumber * pageHeight); // Điều chỉnh vị trí để hiển thị phần tiếp theo
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'), 
          'PNG', 
          0, 
          position, 
          imgWidth, 
          imgHeight, 
          undefined, 
          'FAST'
        );
        heightLeft -= pageHeight;
        pageNumber++;
      }
      
      // Lưu file với tên mặc định
      const lastName = formData?.personalInfo?.lastName || 'Doe';
      const firstName = formData?.personalInfo?.firstName || 'John';
      pdf.save(`${lastName}_${firstName}_CV.pdf`);
      
      console.log('PDF export completed successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div>
      {/* Button xuất PDF */}
      <button 
        onClick={exportToPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm mb-4 flex items-center"
      >
        <i className="fas fa-file-pdf mr-2"></i>
        Export to PDF
      </button>
      
      {/* Container chứa template để render sang PDF */}
      <div ref={templateRef} className="pdf-container">
        <MinimalistTemplate formData={formData} />
      </div>
    </div>
  );
};

// Component ứng dụng chính
const App = () => {
  // Dữ liệu mẫu để test
  const sampleFormData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      professionalHeadline: 'Senior Software Engineer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco',
      country: 'USA',
      website: 'johndoe.com',
      linkedin: 'linkedin.com/in/johndoe'
    },
    summary: 'Experienced software engineer with over 8 years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about creating scalable and user-friendly applications.',
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        startDate: '2020-01-01',
        isPresent: true,
        description: 'Lead development of enterprise SaaS platforms using React, Node.js, and AWS. Improved system performance by 40% and implemented CI/CD pipelines.'
      },
      {
        position: 'Software Developer',
        company: 'Digital Innovations',
        startDate: '2016-03-01',
        endDate: '2019-12-31',
        description: 'Developed and maintained web applications using JavaScript, React, and Express.'
      }
    ],
    education: [
      {
        degree: 'Master of Science',
        field: 'Computer Science',
        institution: 'Stanford University',
        startDate: '2014-09-01',
        endDate: '2016-06-01',
        description: 'Specialized in Software Engineering and Machine Learning'
      },
      {
        degree: 'Bachelor of Science',
        field: 'Computer Engineering',
        institution: 'University of California, Berkeley',
        startDate: '2010-09-01',
        endDate: '2014-05-01'
      }
    ],
    skills: [
      'JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL', 
      'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'SQL', 
      'REST API Design', 'System Architecture', 'CI/CD'
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        role: 'Lead Developer',
        startDate: '2019-06-01',
        endDate: '2020-02-01',
        description: 'Built a scalable e-commerce platform using MERN stack with 20,000+ monthly active users. Implemented payment processing and inventory management systems.',
        url: 'github.com/johndoe/ecommerce-platform'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2022-01-15',
        doesNotExpire: false,
        expirationDate: '2025-01-15'
      },
      {
        name: 'MongoDB Certified Developer',
        issuer: 'MongoDB Inc.',
        issueDate: '2021-05-10',
        doesNotExpire: true
      }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Professional' },
      { language: 'French', proficiency: 'Intermediate' }
    ],
    activities: [
      {
        organization: 'Code for America',
        role: 'Volunteer Developer',
        startDate: '2018-03-01',
        isPresent: true,
        description: 'Contribute to open-source projects that help local governments better serve their communities.'
      }
    ],
    additionalInfo: {
      interests: 'Artificial Intelligence, Blockchain Technology, Hiking, Photography',
      achievements: 'Speaker at React Conference 2022. Published article on Medium about microservices architecture with over 50,000 views.',
      publications: 'Smith, J., & Doe, J. (2023). "Modern Approaches to Microservices Architecture." Journal of Software Engineering, 45(2), 112-128.'
    },
    customFields: [
      {
        label: 'Professional Memberships',
        value: 'IEEE Computer Society, ACM'
      }
    ]
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CV PDF Exporter</h1>
      <PDFExporter formData={sampleFormData} />
    </div>
  );
};

export default App;