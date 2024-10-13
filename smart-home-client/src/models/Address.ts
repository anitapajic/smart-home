export interface Address{
    location: string;
    city: string;
    country: string;
    longitude: number;
    latitude: number;
}
export interface Country {
    id: number,
    name: string
}

export interface City {
    id: number,
    name: string
    city: number
}