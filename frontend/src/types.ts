export interface User {
    username: string;
    role: string;
}

export interface UrlMapping {
    id: number;
    originalUrl: string;
    shortUrl: string;
    clickCount: number;
    createdDate: string;
    username: string;
}

export interface ClickEvent {
    clickDate: string;
    count: number;
    shortUrl?: string;
    originalUrl?: string;
}
