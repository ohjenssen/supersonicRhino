export interface Set {
    setID: number;
    weight: number;
    repetitions: number;
    exerciseID: number;
    time: string;
    userID: number;
}

export interface Exercise {
    exerciseID: number;
    exerciseName: string;
}