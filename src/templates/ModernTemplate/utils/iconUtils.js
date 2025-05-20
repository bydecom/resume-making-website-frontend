export const renderIcon = (iconClass, fallbackText = "•") => {
  return (
    <span className="pdf-safe-icon" data-icon={iconClass}>
      <i className={iconClass}></i>
      <span className="pdf-icon-fallback">{fallbackText}</span>
    </span>
  );
};

export const formatDate = (dateString, isPresent = false) => {
  if (isPresent) return 'Present';
  if (!dateString) return '';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}; 