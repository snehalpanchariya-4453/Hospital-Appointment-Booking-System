/**
 * Helper to generate time slots for a doctor given their working hours and duration
 */
const generateTimeSlots = (start = '09:00', end = '17:00', durationMinutes = 30) => {
  const slots = [];
  
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  let currentTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;
  
  while (currentTotalMinutes + durationMinutes <= endTotalMinutes) {
    const hours24 = Math.floor(currentTotalMinutes / 60);
    const mins = currentTotalMinutes % 60;
    
    // Format to 12-hour AM/PM
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const formattedHour = String(hours12).padStart(2, '0');
    const formattedMin = String(mins).padStart(2, '0');
    
    slots.push(`${formattedHour}:${formattedMin} ${period}`);
    currentTotalMinutes += durationMinutes;
  }
  
  return slots;
};

/**
 * Returns day name from date string or Date object
 */
const getDayName = (dateInput) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(dateInput);
  return days[d.getDay()];
};

module.exports = {
  generateTimeSlots,
  getDayName,
};
