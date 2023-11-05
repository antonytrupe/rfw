import { useMemo } from 'react';
import './CharacterUI.scss'

import Character from "@/Character"

export default function CharacterUI({ character, children, isControlled, isSelected, isClaimed }: {
    character: Character, children: any, isControlled: boolean, isSelected: boolean, isClaimed: boolean
}) {

    const statusStyle = useMemo(() => {
        if (isSelected && isControlled) {
            //green
            //ctx.fillStyle = '#4fbd5b'
            //ctx.strokeStyle = "#3b9f46"
            return 'selectedControlled'
        }
        else if (isControlled) {
            //green
            //ctx.fillStyle = '#4fbd5b'
            //ctx.strokeStyle = "#3b9f46"
            return 'controlled'
        }
        else if (isSelected && isClaimed) {
            //purple
            //ctx.fillStyle = '#fb86ed'
            //ctx.strokeStyle = "#f94de4"
            return 'selectedClaimed'
        }
        else if (isSelected) {
            //green
            //ctx.fillStyle = '#4fbd5b'
            //ctx.strokeStyle = "#3b9f46"
            return 'selected'
        }
        else if (isClaimed) {
            //blue
            //ctx.fillStyle = '#2070f0'
            //ctx.strokeStyle = "#0e59d0"
            return 'claimed'
        }
        else {
            //grey
            //ctx.fillStyle = "#F0F0F0"
            //ctx.strokeStyle = "#cacaca"
            return ''
        }
    }, [isControlled, isSelected, isClaimed]);

    return (
        <div key={character.id} className={`card character ${statusStyle}`} style={{ display: 'flex', flexDirection: 'row' }}>
            <div className="stats" >
                <div> level {character.level} {character.characterClass}</div>
                <div> {character.hp} / {character.maxHp} HP</div>
                <div> Speed:{character.maxSpeed}ft</div>
                <div> ID:{character.id}</div>
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