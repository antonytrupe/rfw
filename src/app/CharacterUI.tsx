import './CharacterUI.scss'

import Character from "@/types/Character"
import { Point } from '@/types/Point'

export default function CharacterUI({ character, position, children = undefined }: {
    character: Character | undefined, position: Point | undefined, children?: any
}) {

    return (
        character &&
        <div className={`card character`}
            style={{ display: "flex", position: "absolute", flexDirection: 'row', top: `${position?.y}px`, left: `${position?.x}px` }}>
            <div className="stats" >
                <div>level {character?.level} {character?.characterClass}</div>
                <div>{character?.race}</div>
                <div>{character?.hp} / {character?.maxHp} HP</div>
                <div>Direction:{Math.round(character?.rotation)}</div>
                <div>Speed:{character?.maxSpeed}ft</div>
                <div>Action:{character?.actions[0]?.action}</div>
                <div>XP:{character?.xp}</div>
                <div>ID:{character?.id}</div>

                {
                    /*
                   <div> Actions:{character?.actionsRemaining}</div>
                   <div> Target:{character?.target}</div>
                <div> Targeters:{character?.targeters}</div>
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