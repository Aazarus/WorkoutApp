import { Preferences, defaultPreferences } from './preferences';

export interface User {
    username: string;
    email?: string;
    forename?: string;
    surname?: string;
    preferences: Preferences;
    needsOnboarding: boolean;
};

export const defaultUser = (): User => {
    return {
        username: '',
        preferences: defaultPreferences(),
        needsOnboarding: true
    };
};