export default interface GameEvent {
    target: string
    type: string
    amount?: number
    time: number
    message?: string
}