export const readSetsByExercise = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:8080/api/sets/exercise/${id}`);
        const data = await response.json();
        
        return data;
    } catch(error) {
        console.log('error: ', error);
    }
}