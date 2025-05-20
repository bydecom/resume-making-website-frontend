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