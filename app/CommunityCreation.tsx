import { useState } from 'react';
import styles from './CommunityCreation.module.scss'


export default function CommunityCreation({ children, action }: { children: any, action: any }) {

    const [communitySize, setCommunitySize] = useState('THORP')
    const [race, setRace] = useState('HUMAN')

    return (
        <div className={`${styles.card}`}>
            <button onClick={() => {
                action({ size: communitySize, race: race })
            }}>Create Community</button>
            <label>Size :
                <select
                    value={communitySize}
                    onChange={e => setCommunitySize(e.target.value)} >
                    <option value="THORP">Thorp</option>
                    <option value="HAMLET">Hamlet</option>
                    <option value="VILLAGE">Village</option>
                    <option value="SMALL_TOWN">Small Town</option>
                    <option value="LARGE_TOWN">Large Town</option>
                    <option value="SMALL_CITY">Small City</option>
                </select>
            </label>
            <label> Race :
                <select
                    value={race}
                    onChange={e => setCommunitySize(e.target.value)} >
                    <option value="HUMAN">Human</option>
                    <option value="HALFLING">Halfling</option>
                    <option value="ELF">Elf</option>
                    <option value="DWARF">DWARF</option>
                    <option value="GNOME">Gnome</option>
                    <option value="ORC">Orc</option>
                    <option value="GOBLIN">Goblin</option>
                    <option value="TROLL">Troll</option>
                </select>
            </label>
        </div>
    )
}