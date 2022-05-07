import { Weight } from './weights';

export interface Preferences {
    weight: Weight;
    darkTheme: boolean;
};

export const defaultPreferences = (): Preferences => {
    return {
        weight: Weight.lb,
        darkTheme: false
    };
};