import { BodyTargetArea } from './bodyTargetArea';

export interface ExerciseResult {
    id: number;
    title: string;
    reps: string[];
    expectedReps: string[];
    sets: number;
    bodyTargetArea: BodyTargetArea[]
    notes?: string;
    weight?: string[];
};