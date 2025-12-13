export const readExercises = async () => {
    try {
        // // const response = await fetch('https://supersonicrhinoapi.onrender.com/api/exercises');
        const response = await fetch('http://localhost:8080/api/exercises');
        const data = await response.json();
        
        return data;
    } catch(error){
        console.log('error: ', error)
    }
}