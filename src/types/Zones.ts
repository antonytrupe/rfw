import Character from "./Character"

export type Zone = Set<string>
export type Zones = Map<string, Zone>

export type Zone2 = Map<string, Character | undefined>
export type Zones2 = Map<string, Zone2>
