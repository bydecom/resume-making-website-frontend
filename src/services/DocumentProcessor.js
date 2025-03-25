import { createWorker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';

// Sử dụng cdnjs thay vì unpkg
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
// Lưu ý: Sử dụng .js thay vì .mjs để đảm bảo tính tương thích

/**
 * Trích xuất văn bản từ file (PDF hoặc hình ảnh)
 * @param {File} file - File được tải lên
 * @param {string} language - Ngôn ngữ OCR (mặc định: 'eng')
 * @returns {Promise<string>} Văn bản trích xuất
 */
export async function extractTextFromFile(file, language = 'eng') {
  console.log('[DocumentProcessor] Bắt đầu trích xuất từ file:', file.name, file.type);
  
  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file, language);
  } else if (file.type.startsWith('image/')) {
    return await extractTextFromImage(file, language);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    throw new Error('Xử lý file DOCX cần thư viện mammoth.js. Vui lòng sử dụng PDF hoặc hình ảnh.');
  } else {
    throw new Error(`Định dạng file không được hỗ trợ: ${file.type}`);
  }
}

/**
 * Trích xuất văn bản từ file PDF
 * @param {File} file - File PDF
 * @param {string} language - Ngôn ngữ OCR
 * @returns {Promise<string>} Văn bản trích xuất
 */
async function extractTextFromPDF(file, language) {
  console.log('[DocumentProcessor] Đang xử lý PDF:', file.name);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    console.log(`[DocumentProcessor] PDF có ${pdf.numPages} trang`);

    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`[DocumentProcessor] Đang xử lý trang ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      
      const sampleText = pageText.length > 100 ? 
        pageText.substring(0, 100) + '...' : pageText;
      console.log(`[DocumentProcessor] Trang ${i} - Mẫu văn bản: "${sampleText}"`);
      
      fullText += pageText + '\n';
    }

    // Nếu PDF không chứa văn bản có thể trích xuất (có thể là scan hoặc hình ảnh)
    if (fullText.trim() === '') {
      console.warn('[DocumentProcessor] PDF không chứa văn bản thực, chuyển sang OCR...');
      fullText = await extractTextUsingOCR(pdf, language);
    }

    return fullText.trim();
  } catch (error) {
    console.error('[DocumentProcessor] Lỗi khi xử lý PDF:', error);
    throw error;
  }
}

/**
 * Trích xuất văn bản từ PDF sử dụng OCR (cho PDF scan)
 * @param {Object} pdf - Đối tượng PDF đã được tải
 * @param {string} language - Ngôn ngữ OCR
 * @returns {Promise<string>} Văn bản trích xuất bằng OCR
 */
async function extractTextUsingOCR(pdf, language = 'eng') {
  console.log('[DocumentProcessor] Bắt đầu OCR cho PDF scan...');
  
  try {
    const numPages = pdf.numPages;
    let ocrText = '';
    
    // Khởi tạo worker tesseract
    console.log('[DocumentProcessor] Khởi tạo Tesseract worker...');
    const worker = await createWorker(language);
    
    for (let i = 1; i <= numPages; i++) {
      console.log(`[DocumentProcessor] OCR trang ${i}/${numPages}...`);
      const page = await pdf.getPage(i);

      // Render trang PDF vào canvas
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      console.log(`[DocumentProcessor] Rendering trang ${i} vào canvas...`);
      await page.render({ canvasContext: context, viewport }).promise;

      // Chuyển canvas thành hình ảnh và thực hiện OCR
      const dataUrl = canvas.toDataURL('image/png');
      console.log(`[DocumentProcessor] Đang thực hiện OCR trên trang ${i}...`);
      
      const { data: { text } } = await worker.recognize(dataUrl, language);
      console.log(`[DocumentProcessor] OCR trang ${i} hoàn tất. Mẫu văn bản: "${text.substring(0, 100)}..."`);
      
      ocrText += text + ' ';
    }

    // Giải phóng worker
    console.log('[DocumentProcessor] Đang giải phóng Tesseract worker...');
    await worker.terminate();
    
    return ocrText.trim();
  } catch (error) {
    console.error('[DocumentProcessor] Lỗi trong quá trình OCR:', error);
    throw error;
  }
}

/**
 * Trích xuất văn bản từ file hình ảnh
 * @param {File} file - File hình ảnh
 * @param {string} language - Ngôn ngữ OCR
 * @returns {Promise<string>} Văn bản trích xuất bằng OCR
 */
async function extractTextFromImage(file, language = 'eng') {
  console.log('[DocumentProcessor] Đang xử lý hình ảnh:', file.name);
  
  try {
    // Khởi tạo worker tesseract
    console.log('[DocumentProcessor] Khởi tạo Tesseract worker...');
    const worker = await createWorker(language);
    
    // Thực hiện OCR trên hình ảnh
    console.log('[DocumentProcessor] Đang thực hiện OCR trên hình ảnh...');
    const { data: { text } } = await worker.recognize(URL.createObjectURL(file));
    
    console.log(`[DocumentProcessor] OCR hoàn tất. Mẫu văn bản: "${text.substring(0, 100)}..."`);
    
    // Giải phóng worker
    await worker.terminate();
    
    return text.trim();
  } catch (error) {
    console.error('[DocumentProcessor] Lỗi khi xử lý hình ảnh:', error);
    throw error;
  }
}

/**
 * Trích xuất văn bản từ URL PDF
 * @param {string} url - URL đến file PDF
 * @param {string} language - Ngôn ngữ OCR
 * @returns {Promise<string>} Văn bản trích xuất
 */
export async function extractTextFromURL(url, language = 'eng') {
  console.log('[DocumentProcessor] Đang xử lý PDF từ URL:', url);
  
  try {
    // Fetch PDF từ URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Không thể tải PDF từ URL: ${response.statusText}`);
    }
    
    // Xử lý PDF từ arrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    console.log(`[DocumentProcessor] PDF có ${pdf.numPages} trang`);
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`[DocumentProcessor] Đang xử lý trang ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    // Kiểm tra nếu PDF không chứa văn bản
    if (fullText.trim() === '') {
      console.warn('[DocumentProcessor] PDF không chứa văn bản thực, chuyển sang OCR...');
      fullText = await extractTextUsingOCR(pdf, language);
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('[DocumentProcessor] Lỗi khi xử lý PDF từ URL:', error);
    throw error;
  }
}

// Class DocumentProcessor chứa tất cả các phương thức tĩnh
class DocumentProcessor {
  static async extractTextFromFile(file, language = 'eng') {
    return extractTextFromFile(file, language);
  }
  
  static async extractTextFromURL(url, language = 'eng') {
    return extractTextFromURL(url, language);
  }
}

export default DocumentProcessor; 