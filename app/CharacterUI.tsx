import { useEffect, useMemo, useState } from 'react';
import './CharacterUI.scss'

import Character from "@/Character"

export default function CharacterUI({ character, position, children = undefined }: {
    character: Character | undefined, position: { x: number, y: number }|undefined, children?: any
}) {

    return (
        character &&
        <div className={`card character`}
            style={{ display: "flex", position: "absolute", flexDirection: 'row', top: `${position?.y}px`, left: `${position?.x}px` }}>
            <div className="stats" >
                <div> level {character?.level} {character?.characterClass}</div>
                <div> {character?.hp} / {character?.maxHp} HP</div>
                <div> Speed:{character?.maxSpeed}ft</div>
                <div> Actions:{character?.actionsRemaining}</div>
                <div> XP:{character?.xp}</div>
                <div> Level:{character?.level}</div>
                <div> Target:{character?.target}</div>
                {
                    /*
                   
                    <div> size:{character.size}</div>
                    <div> direction:{character.direction.toFixed(2)}</div>
                    <div> Run/walk:{character.mode == 1 ? 'Running' : character.mode == 2 ? 'Sprinting' : 'Wat'}</div>
                    <div> x:{character.x.toFixed(2)}</div>
                    <div> y:{character.y.toFixed(2)}</div>
                    */
                }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    )
}