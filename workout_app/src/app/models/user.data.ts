import { Program } from './program';
import { User, defaultUser } from './user';

export interface UserData {
    user: User;
    currentProgram?: Program;
    completedPrograms?: Program[];
};

export const defaultUserData = (): UserData => {
    return {
        user: defaultUser(),
        currentProgram: null,
        completedPrograms: null
    };
};