import styles from './CharacterUI.module.scss'

import Character from "@/Character"

export default function CharacterUI({ character, children }: { character: Character, children: any }) {
    return (
        <div key={character.id} className={`${styles.card} ${styles.character}`}>
            <div>
                <div> level {character.level} {character.characterClass}</div>
                <div> {character.hp} / {character.maxHp} HP</div>
                <div> Speed:{character.maxSpeed}ft</div>
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
            {children}
        </div>
    )
}