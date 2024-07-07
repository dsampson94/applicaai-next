export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    userCVName?: string;
    userCVUrl?: string;
    applications: Application[];
}

export interface Application {
    id: string;
    role: string;
    company: string;
    status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    appliedAt: string;
    interviewDate?: string;
    offerDate?: string;
    unsuccessfulDate?: string;
    jobSpecUrl?: string;
    jobSpecName?: string;
    cvName?: string;
    tags: string[];
    mockInterviewResponses: string[];
    suitabilityResponses: string[];
    tipsResponses: string[];
    isFavorite: boolean;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
