"use client"
import './table.scss'
import { Suspense, useEffect, useState } from "react"

export default function CharacterList({ columns, id = "id", endpoint }) {

    function sortData(compare: ((a: any, b: any) => number) | undefined) {
        setData([...data].sort(compare))
    }

    function rowClick(id: string) {
        if (id != editId) {
            setEditId("")
        }
    }

    const [data, setData] = useState<any[]>([])
    const [selected, setSelected] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    const [editId, setEditId] = useState<string>()

    useEffect(() => {
        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [])

    function selectAll(): void {
        setAllSelected(!allSelected)
        if (selected.length != data.length) {
            setSelected(data.map((c) => c[id]))
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

        if (selected.length != data.length) {
            setAllSelected(false)
        }
        else {
            setAllSelected(true)
        }
    }

    function deleteItems() {
        //console.log(JSON.stringify(selected))
        fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selected)
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }

    return (
        <div className="table">
            <div className="table-row table-header">

                <span className="table-cell" ><input type="checkbox" onChange={selectAll} checked={allSelected} /><button onClick={deleteItems}>delete</button>
                </span>

                {columns.map(({ label, name }: { label: string, name: string }) => {
                    return <span className="table-cell" key={name}>{label}
                        <span className="sorter" onClick={() => {
                            sortData((a, b) => {
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
                            sortData((a, b) => {
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
                {data.map((item) => {
                    return (
                        <div className="table-row" key={item[id]}>
                            <span className="table-cell" ><input type="checkbox" onChange={() => checkRow(item[id])} checked={selected.includes(item[id])} />
                            </span>
                            {columns.map(({ label, name }: { label: string, name: string }) => {
                                return <span key={name} className="table-cell" onClick={() => rowClick(item[id])} onDoubleClick={() => setEditId(item[id])}>
                                    {item[id] == editId ? (<input size={(item as any)[name]?.toString().length} defaultValue={(item as any)[name]} />) : (item as any)[name]}
                                </span>
                            })}
                        </div>)
                })}
            </Suspense>
        </div>
    )
}