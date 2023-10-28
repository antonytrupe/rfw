import Character from "@/Character"

export default function CharacterUI({ character, children }: { character: Character,children: any }) {
    return (
        <div key={character.id}>
            <div>  <div> id:{character.id}</div>
                <div> direction:{character.direction}</div>
                <div> hp:{character.hp}</div>
                <div> maxHp:{character.maxHp}</div>
                <div> size:{character.size}</div>
                <div> speed:{Math.round(character.speed)}</div>
                <div> maxSpeed:{character.maxSpeed}</div>
                <div> Run/walk:{character.mode == 1 ? 'Running' : character.mode == 2 ? 'Sprinting' : 'Wat'}</div>
                <div> x:{character.x.toFixed(2)}</div>
                <div> y:{character.y.toFixed(2)}</div>
            </div>
            {children}
        </div>
    )
}