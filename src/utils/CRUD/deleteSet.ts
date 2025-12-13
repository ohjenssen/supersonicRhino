export const deleteSet = async (id: number) => {
        try {
        const response = await fetch(`http://localhost:8080/api/sets/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
    } catch(error) {
        console.log('error: ', error);
    }
}