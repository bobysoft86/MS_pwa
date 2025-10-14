import { Exercise } from "./exercise.interface";

export interface Session {
  id?: number;
  title?: string;
  notes?: string;
  type_id?: number;
  restTime?: number;
  exercises?: SessionExercise[]; 
  createdAt?: Date;
  updatedAt?: Date;
}
export interface SessionType {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionExercise    {
            id: 1,
            exercise: Exercise
            weight:string,
            reps: number,
            order_index: number
        }