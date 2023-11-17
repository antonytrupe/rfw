import { useState } from 'react';
import styles from './CommunityCreation.module.scss'


export default function CommunityCreation({ children, action }: { children: any, action: any }) {

    const [size, setSize] = useState('THORP')
    const [race, setRace] = useState('HUMAN')

    return (
        <div className={`${styles.card}`}>
            <button onClick={() => {
                action({ size: size, race: race })
            }}>Create Community</button>
            <label>Size :
                <select
                    value={size}
                    onChange={e => setSize(e.target.value)} >
                    <option value="THORP">Thorp(~50)</option>
                    <option value="HAMLET">Hamlet(~240)</option>
                    <option value="VILLAGE">Village(~650)</option>
                    <option value="SMALL_TOWN">Small Town(~1450)</option>
                    <option value="LARGE_TOWN">Large Town(~3500)</option>
                    <option value="SMALL_CITY">Small City(~8500)</option>
                </select>
            </label>
            <label> Race :
                <select
                    value={race}
                    onChange={e => setRace(e.target.value)} >
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