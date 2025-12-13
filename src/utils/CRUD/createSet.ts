export const createSet = async (set: any) => {
    try {
        const response = await fetch('http://localhost:8080/api/sets', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(set)
        });
        const data = await response.json();
        return data;
    } catch(error) {
        console.log('error: ', error);
    }
}