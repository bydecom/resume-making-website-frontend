// src/services/pdfExportService.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportCVToPDF = async ({
  cvElement,
  formData,
  onStatusChange = () => {},
  onError = () => {},
}) => {
  let cleanupFontAwesome;
  try {
    onStatusChange(true);
    console.log('Starting section-by-section PDF export...');

    if (!cvElement) throw new Error('CV element not found');

    // Nhúng FontAwesome CSS vào DOM
    const cleanupFontAwesome = injectFontAwesomeCSS();
    cvElement.classList.add('exporting-pdf');

    // Chờ cho fonts và layout ổn định
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    let currentY = 0; // Vị trí y ban đầu

    const sections = Array.from(cvElement.querySelectorAll('.cv-section'));
    const scale = 3;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      try {
        const canvas = await html2canvas(section, {
          scale,
          useCORS: true,
          allowTaint: true,
        });

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Section ${i} canvas invalid, skipping.`);
          continue;
        }

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = PAGE_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Nếu currentY cộng thêm imgHeight vượt quá chiều cao trang, thêm trang mới
        if (currentY + imgHeight > PAGE_HEIGHT) {
          pdf.addPage();
          currentY = 0; // Reset currentY khi thêm trang mới
        }

        // Thêm section vào PDF
        pdf.addImage(imgData, 'PNG', 0, currentY, imgWidth, imgHeight, undefined, 'FAST');
        currentY += imgHeight ; // Cập nhật vị trí y sau khi thêm ảnh

      } catch (err) {
        console.error(`Error rendering section ${i}:`, err);
        continue;
      }
    }

    const lastName = formData?.personalInfo?.lastName || '';
    const firstName = formData?.personalInfo?.firstName || 'my';
    const fileName = `${firstName}${lastName ? '_' + lastName : ''}_CV.pdf`;

    pdf.save(fileName);
    console.log('Section-based PDF export completed!');
  } catch (error) {
    console.error('Error during section export:', error);
    onError(error);
  } finally {
    onStatusChange(false);
    cvElement.classList.remove('exporting-pdf');
    cleanupFontAwesome?.();
  }
};

export const exportResumeToPDF = async ({
  resumeElement,
  formData,
  onStatusChange = () => {},
  onError = () => {},
}) => {
  let cleanupFontAwesome;
  try {
    onStatusChange(true);
    console.log('Starting section-by-section Resume PDF export...');

    if (!resumeElement) throw new Error('Resume element not found');

    // Inject FontAwesome CSS into DOM
    const cleanupFontAwesome = injectFontAwesomeCSS();
    resumeElement.classList.add('exporting-pdf');

    // Wait for fonts and layout to stabilize
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    let currentY = 0; // Initial y position

    const sections = Array.from(resumeElement.querySelectorAll('.cv-section'));
    const scale = 3;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      try {
        const canvas = await html2canvas(section, {
          scale,
          useCORS: true,
          allowTaint: true,
        });

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Section ${i} canvas invalid, skipping.`);
          continue;
        }

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = PAGE_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If currentY plus imgHeight exceeds page height, add a new page
        if (currentY + imgHeight > PAGE_HEIGHT) {
          pdf.addPage();
          currentY = 0; // Reset currentY when adding a new page
        }

        // Add section to PDF
        pdf.addImage(imgData, 'PNG', 0, currentY, imgWidth, imgHeight, undefined, 'FAST');
        currentY += imgHeight; // Update y position after adding image
      } catch (err) {
        console.error(`Error rendering section ${i}:`, err);
        continue;
      }
    }

    const lastName = formData?.personalInfo?.lastName || '';
    const firstName = formData?.personalInfo?.firstName || 'my';
    const position = formData?.personalInfo?.professionalHeadline || formData?.roleApply || '';
    const fileName = `${firstName}${lastName ? '_' + lastName : ''}_Resume${position ? '_' + position : ''}.pdf`;

    pdf.save(fileName);
    console.log('Resume PDF export completed!');
  } catch (error) {
    console.error('Error during resume export:', error);
    onError(error);
  } finally {
    onStatusChange(false);
    resumeElement.classList.remove('exporting-pdf');
    cleanupFontAwesome?.();
  }
};

// Helper function để nhúng FontAwesome CSS
const injectFontAwesomeCSS = () => {
  const allCSS = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const sheet = document.styleSheets[i];
      if (sheet.href && sheet.href.includes('fontawesome')) {
        const rules = sheet.cssRules || sheet.rules;
        for (let j = 0; j < rules.length; j++) {
          allCSS.push(rules[j].cssText);
        }
      }
    } catch (e) {
      console.log('Error accessing stylesheet', e);
    }
  }

  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', 'fa-styles-for-print');
  styleEl.innerHTML = allCSS.join('\n');
  document.head.appendChild(styleEl);

  return () => {
    if (document.getElementById('fa-styles-for-print')) {
      document.getElementById('fa-styles-for-print').remove();
    }
  };
};
