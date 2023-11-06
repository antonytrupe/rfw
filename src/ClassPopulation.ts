export interface ClassPopulation {
    className: string;
    diceCount: number;
    diceSize: number;
    modifier: number;
    origin: {
        x: number;
        y: number;
    };
    radius: number;
}
