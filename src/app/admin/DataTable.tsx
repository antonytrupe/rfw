"use client"
import './table.scss'
import { Suspense, useEffect, useState } from "react"

export default function DataTable({ columns, id = "id", endpoint }) {


    //TODO remember the sort order

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
            setSelected([...selected, id])
        } else {
            setSelected(selected.filter((item) => item !== id))
        }

        if (selected.length != data.length) {
            setAllSelected(false)
        }
        else {
            setAllSelected(true)
        }
    }

    function updateRow(id: string, formData: FormData) {

        fetch(endpoint, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...Object.fromEntries(formData),id})
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })

        setEditId('')
    }

    function deleteItems() {
        console.log(JSON.stringify(selected))
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

    function reloadDatastore(): void {
        fetch(endpoint + '?reload=datastore')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }

    function reloadMemory(): void {
        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }

    return (<>
        <button onClick={reloadDatastore}>reload from datastore</button>
        <button onClick={reloadMemory}>reload from memory</button>
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
                    return item[id] == editId ?
                        <DataTableRowForm key={item[id]} columns={columns} item={item} id={id} checkRow={checkRow} selected={selected.includes(item[id])} updateRow={updateRow} /> :
                        <DataTableRow key={item[id]} columns={columns} item={item} id={id} rowClick={rowClick} setEditId={setEditId}
                            checkRow={checkRow} selected={selected.includes(item[id])} />
                })}
            </Suspense>
        </div></>
    )
}

export function DataTableRowForm({ columns, item, id = "id", checkRow, selected, updateRow }) {

    return (<form action={updateRow.bind(null, item[id])} className="table-row" >
        <span className="table-cell" >
            <input type="checkbox" onChange={() => checkRow(item[id])} checked={selected} />
            <button>save</button>
        </span>

        {columns.map(({ label, name }: { label: string, name: string }) => {
            return <span key={name} className="table-cell"  >
                <input size={(item as any)[name]?.toString().length} name={name} defaultValue={(item as any)[name]} />
            </span>
        })}</form>)
}

export function DataTableRow({ columns, item, id = "id", rowClick, setEditId, checkRow, selected }) {
    return (<div className="table-row"  >
        <span className="table-cell" >
            <input type="checkbox" onChange={() => checkRow(item[id])} checked={selected} />
        </span>

        {columns.map(({ label, name }: { label: string, name: string }) => {
            return <span key={name} className="table-cell" onClick={() => rowClick(item[id])} onDoubleClick={() => setEditId(item[id])}>
                {(item as any)[name]}
            </span>
        })}</div>)
}