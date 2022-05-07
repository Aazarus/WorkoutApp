import { Day } from "./day";

export interface Week {
    days: Day[];
    startDate?: string;
    endDate?: string;
    notes?: string;
    completed: boolean;
    title: string;
};