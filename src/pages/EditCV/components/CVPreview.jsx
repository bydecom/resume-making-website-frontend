import React, { useEffect, useState, memo } from 'react';
import { getTemplateById, getDefaultTemplate } from '../../../templates';

const CVPreview = ({ formData }) => {
  // State để lưu trữ dữ liệu đã xử lý
  const [processedData, setProcessedData] = useState(formData);

  // Cập nhật processedData khi formData thay đổi
  useEffect(() => {
    console.log("CV Preview received new data:", formData);
    setProcessedData(formData);
  }, [formData]);

  // Xác định template nào được sử dụng
  const templateId = processedData?.template?.id;
  const template = templateId ? getTemplateById(templateId) : getDefaultTemplate();
  const TemplateComponent = template.component;

  // Render template đã chọn với dữ liệu CV
  return <TemplateComponent formData={processedData} />;
};

export default memo(CVPreview);