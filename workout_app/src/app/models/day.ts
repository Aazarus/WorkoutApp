import { ExerciseResult } from './exerciseResult';

export interface Day {
    exercises: number[];
    exerciseResults: ExerciseResult[];
    completed: boolean;
    notes?: string;
    title: string;
};