import { useState } from 'react';
import styles from './CommunityCreation.module.scss'
import { COMMUNITY_SIZE } from '@/types/CommunitySize';
import { deprecate } from 'util';

//@deprecate
export default function CommunityCreation({ action }: { action: any }) {

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
                    <option value={COMMUNITY_SIZE.THORP}>Thorp(~50)</option>
                    <option value={COMMUNITY_SIZE.HAMLET}>Hamlet(~240)</option>
                    <option value={COMMUNITY_SIZE.VILLAGE}>Village(~650)</option>
                    <option value={COMMUNITY_SIZE.SMALL_TOWN}>Small Town(~1450)</option>
                    <option value={COMMUNITY_SIZE.LARGE_TOWN}>Large Town(~3500)</option>
                    <option value={COMMUNITY_SIZE.SMALL_CITY}>Small City(~8500)</option>
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