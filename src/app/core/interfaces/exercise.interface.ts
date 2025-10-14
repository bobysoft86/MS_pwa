export interface Exercise{
    id?: number;
    title: string;
    imgUrl?: string;
    videoUrl?: string;
    type_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    video?: File | null;
    image?: File | null;
}

export interface ExerciseType{
    id: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}