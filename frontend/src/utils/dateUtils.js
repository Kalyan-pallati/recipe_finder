export const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getFloatingWeekDays = (startDateObj) => {
    const dates = [];
    let d = new Date(startDateObj);
    
    for (let i = 0; i < 7; i++) {
        dates.push(formatDate(d));
        d.setDate(d.getDate() + 1); 
    }
    return dates;
};

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const mealTypes = ["breakfast", "lunch", "snack", "dinner"];