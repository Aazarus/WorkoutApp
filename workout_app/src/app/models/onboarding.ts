import { Weight } from './weights';

export interface Onboarding {
    name: string;
    isDarkTheme: boolean;
    weight: Weight;
}

export const defaultOnBoarding = (): Onboarding => {
    return {
        name: '',
        isDarkTheme: false,
        weight: Weight.kg
    }
}