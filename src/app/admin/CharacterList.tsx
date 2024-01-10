"use client"
import Character from "@/types/Character"
import { Suspense, useEffect, useState } from "react"

export default function CharacterList() {

    function sortCharacters(compare: ((a: Character, b: Character) => number) | undefined) { 
        setCharacters([...characters].sort(compare))
    }

    const [characters, setCharacters] = useState<Character[]>([])
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

    return (
        <div className="table">
            <div className="table-row">
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
                            {columns.map(({ label, name }: { label: string, name: string }) => {
                                return <span key={name} className="table-cell" onDoubleClick={() => setEditId(character.id)}>
                                    {character.id == editId ? (<input size={(character as any)[name]?.toString().length} defaultValue={(character as any)[name]} />) : (character as any)[name]}
                                </span>
                            })}
                        </div>)
                })}
            </Suspense>
        </div>
    )
}