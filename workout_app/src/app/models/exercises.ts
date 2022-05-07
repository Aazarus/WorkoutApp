import { BodyTargetArea } from './bodyTargetArea';

export interface Exercise {
    id: number;
    title: string;
    reps: string[];
    sets: number;
    bodyTargetArea: BodyTargetArea[]
    notes?: string;
    completed: boolean;
};