export interface Measure{
    deviceId: number,
    topic: string,
    name: string,
    value: number,
    timestamp: Date
    online: boolean
}

export interface Period{
    from: Date | null,
    to: Date | null,
    periodType: string,
    period: number
}
export interface MeasureString {
    deviceId: number,
    topic: string,
    name: string,
    registrationNumber: string,
    timestamp: Date
}