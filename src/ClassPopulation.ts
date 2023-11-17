import { Point } from "./Point";

export interface ClassPopulation {
    className: string;
    diceCount: number;
    diceSize: number;
    modifier: number;
    origin: Point;
    radius: number;
}