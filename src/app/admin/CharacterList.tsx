"use client"
import Character from "@/types/Character"
import { Suspense, useEffect, useState } from "react"

export default function CharacterList() {

    function sortCharacters(compare: ((a: Character, b: Character) => number) | undefined) {
        setCharacters([...characters].sort(compare))
    }

    function rowClick(characterId: string) {
        if (characterId != editId) {
            setEditId("")
        }
    }

    const [characters, setCharacters] = useState<Character[]>([])
    const [selected, setSelected] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    const [editId, setEditId] = useState<string>()

    const columns = [{ label: "Name", name: "name" },
    { label: "Level", name: "level" },
    { label: "Class", name: "characterClass" },
    { label: "Race", name: "race" },
    { label: "Max HP", name: "maxHp" },
    { label: "HP", name: "hp" },
    { label: "Current Speed", name: "speed" },
    { label: "Walk Speed", name: "maxSpeed" },
    ]

    useEffect(() => {
        fetch('/api/characters')
            .then((res) => res.json())
            .then((data) => {
                setCharacters(data)
            })
    }, [])

    function selectAll(): void {
        setAllSelected(!allSelected)
        if (selected.length != characters.length) {
            setSelected(characters.map((c) => c.id))
        }
        else {
            setSelected([])
        }
    }

    function checkRow(id: string): void {
        if (!selected.includes(id)) {
            setSelected([...selected, id]);
        } else {
            setSelected(selected.filter((item) => item !== id));
        }

        if (selected.length != characters.length) {
            setAllSelected(false)
        }
        else {
            setAllSelected(true)
        }
    }

    function deleteCharacters() {
        console.log('deleteCharacters')
        console.log(selected)
        fetch('/api/characters', { method: "DELETE", body: JSON.stringify(selected) })
            .then((res) => res.json())
            .then((data) => {
                //setCharacters(data)
                console.log(data)
            })
    }

    return (
        <div className="table">
            <div className="table-row">

                <span className="table-cell" ><input type="checkbox" onChange={selectAll} checked={allSelected} /><button onClick={deleteCharacters}>delete</button>
                </span>

                {columns.map(({ label, name }: { label: string, name: string }) => {
                    return <span className="table-cell" key={name}>{label}
                        <span className="sorter" onClick={() => {
                            sortCharacters((a, b) => {
                                if (typeof (a as any)[name] == 'number') {
                                    return (a as any)[name] - (b as any)[name]
                                }
                                else if (typeof (a as any)[name] == 'string') {
                                    return (a as any)[name] == (b as any)[name] ? 0 : (a as any)[name] < (b as any)[name] ? -1 : 1
                                }
                                else return 0
                            })
                        }}>↓</span>
                        <span className="sorter" onClick={() => {
                            sortCharacters((a, b) => {
                                if (typeof (a as any)[name] == 'number') {
                                    return (b as any)[name] - (a as any)[name]
                                }
                                else if (typeof (a as any)[name] == 'string') {
                                    return (a as any)[name] == (b as any)[name] ? 0 : (a as any)[name] > (b as any)[name] ? -1 : 1
                                }
                                else return 0
                            })
                        }}>↑</span>
                    </span>
                })}
            </div>
            <div className="table-column-group">
                {columns.map(({ label, name }: { label: string, name: string }) => {
                    return <div className="table-colum" key={name}>{label}</div>
                })}
            </div>
            <Suspense fallback={<span>loading</span>}>
                {characters.map((character: Character) => {
                    return (
                        <div className="table-row" key={character.id}>
                            <span className="table-cell" ><input type="checkbox" onChange={() => checkRow(character.id)} checked={selected.includes(character.id)} />
                            </span>
                            {columns.map(({ label, name }: { label: string, name: string }) => {
                                return <span key={name} className="table-cell" onClick={() => rowClick(character.id)} onDoubleClick={() => setEditId(character.id)}>
                                    {character.id == editId ? (<input size={(character as any)[name]?.toString().length} defaultValue={(character as any)[name]} />) : (character as any)[name]}
                                </span>
                            })}
                        </div>)
                })}
            </Suspense>
        </div>
    )
}