export function sortByTime(meals) {
  // Use the sort method with a custom compare function
  return meals.sort((a, b) => {
    // Convert time strings to comparable timestamps (e.g., in minutes)
    const timeA = convertTimeToMinutes(a.time);
    const timeB = convertTimeToMinutes(b.time);

    // Compare timestamps for sorting
    return timeA - timeB;
  });
}

// Helper function to convert time string (HH:MM) to minutes
function convertTimeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
