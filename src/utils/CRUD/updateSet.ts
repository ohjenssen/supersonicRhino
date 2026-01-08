export const updateSet = async (set: {setID: number, userID: number, weight: number, repetitions: number, exerciseID: number}) => {
    try {
        const response = await fetch(`http://localhost:8080/api/sets/${set.setID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(set)
        });

    } catch(error) {
        console.log(error);
    }
}