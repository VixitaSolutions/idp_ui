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

export interface PreloadedData {
  id: string;
  cName: string;
  bAuthor: string;
  bPublisher: string;
  bPublishingYear: string;
  bTitle: string;
  bUrl: string;
  ocCourse: string;
  ocDescription: string;
  ocUrl: string;
  ocPlatform: string;
  ocImgUrl: string;
  yName: string;
  yDescription: string;
  yUrl: string;
}

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
