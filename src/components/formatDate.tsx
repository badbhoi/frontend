// Helper function to format ISO date string to YYYY-M-D format
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // getMonth() returns 0-11, so add 1
    const day = date.getDate()
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Alternative: More flexible formatter with options
export const formatDateWithOptions = (
  dateString: string, 
  options: {
    includeTime?: boolean
    separator?: string
    padZeros?: boolean
  } = {}
): string => {
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    const { includeTime = false, separator = '-', padZeros = false } = options
    
    const year = date.getFullYear()
    const month = padZeros ? String(date.getMonth() + 1).padStart(2, '0') : date.getMonth() + 1
    const day = padZeros ? String(date.getDate()).padStart(2, '0') : date.getDate()
    
    let formattedDate = `${year}${separator}${month}${separator}${day}`
    
    if (includeTime) {
      const hours = padZeros ? String(date.getHours()).padStart(2, '0') : date.getHours()
      const minutes = padZeros ? String(date.getMinutes()).padStart(2, '0') : date.getMinutes()
      formattedDate += ` ${hours}:${minutes}`
    }
    
    return formattedDate
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Usage examples:
// formatDate("2025-07-06T17:11:30.999853+00:00") // "2025-7-6"
// formatDateWithOptions("2025-07-06T17:11:30.999853+00:00", { padZeros: true }) // "2025-07-06"
// formatDateWithOptions("2025-07-06T17:11:30.999853+00:00", { includeTime: true }) // "2025-7-6 17:11"
// formatDateWithOptions("2025-07-06T17:11:30.999853+00:00", { separator: "/" }) // "2025/7/6"