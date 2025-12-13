export const isToday = (dateString: string): boolean => {
    const date = new Date(dateString); // The date you send in
    const today = new Date(); // Todays date that you compare to... today vs date
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}