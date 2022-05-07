import { Week } from './week';

export interface Program {
    id: number;
    title: string;
    weeks: Week[];
    startDate?: string;
    endDate?: string;
    notes?: string;
    description?: string;
};