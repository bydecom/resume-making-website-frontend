export const formatDate = (dateString, isPresent = false) => {
  if (isPresent) return 'Present';
  if (!dateString) return '';
  
  try {
    // Handle YYYY-00 format
    if (dateString.endsWith('-00')) {
      return dateString.substring(0, 4); // Only return the year
    }
    
    // Check if dateString only has year and month (format: YYYY-MM)
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      const [year, month] = dateString.split('-');
      // If month is '00', only return the year
      if (month === '00') {
        return year;
      }
      // Otherwise, add day 01 for formatting
      dateString = dateString + "-01";
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if parsing fails
    }
    
    return new Intl.DateTimeFormat("en-US", { 
      year: "numeric", 
      month: "long" 
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if there's an error
  }
}; 