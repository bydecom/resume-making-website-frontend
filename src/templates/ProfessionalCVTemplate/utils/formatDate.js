export const formatDate = (dateString, isPresent = false) => {
  if (isPresent) return 'Present';
  if (!dateString) return '';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'numeric', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}; 