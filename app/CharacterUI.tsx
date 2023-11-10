import { useMemo } from 'react';
import './CharacterUI.scss'

import Character from "@/Character"

export default function CharacterUI({ character, children, isControlled = false, isSelected = false, isClaimed = false, isTargeted = false }: {
    character: Character, children: any, isControlled?: boolean, isSelected?: boolean, isClaimed?: boolean, isTargeted?: boolean
}) {

    const statusStyle = useMemo(() => {
        if (isControlled) {
            return 'controlled'
        }
        else if (isSelected) {
            return 'selected'
        } else if (isTargeted) {
            return 'targeted'
        }
        else if (isClaimed) {
            return 'claimed'
        }
        else {
            return ''
        }
    }, [isControlled, isSelected, isClaimed]);

    return (
        <div key={character.id} className={`card character ${statusStyle}`} style={{ display: 'flex', flexDirection: 'row' }}>
            <div className="stats" >
                <div> level {character.level} {character.characterClass}</div>
                <div> {character.hp} / {character.maxHp} HP</div>
                <div> Speed:{character.maxSpeed}ft</div>
                <div> Actions:{character.actionsRemaining}</div>
                <div> Target:{character.target}</div>
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