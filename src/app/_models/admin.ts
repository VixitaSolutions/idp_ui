export interface Client {
    id: string;
    tenantName: string;
    clientName: string;
    clientDescription: string;
    email: string;
    mobile: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    status: string;
}

export type SortColumn = keyof any | '';
export type SortDirection = 'asc' | 'desc' | '';
export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}

export interface GlobalCompetency {
    id: number;
    name: string;
    description: string;
    keywords: string;
    level: number;
}
export interface Competency {
    id: number;
    name: string;
    description: string;
    keywords: string;
    level: number;
    tenantId: string;
    globalCompetency: GlobalCompetency;
}
