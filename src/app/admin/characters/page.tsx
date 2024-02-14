import Table from "../DataTable"

export default async function Page() {
  const columns = [{ label: "Name", name: "name" },
  { label: "Level", name: "level" },
  { label: "Class", name: "characterClass" },
  { label: "Race", name: "race" },
  { label: "Max HP", name: "maxHp" },
  { label: "HP", name: "hp" },
  { label: "Current Speed", name: "speed" },
  { label: "Walk Speed", name: "maxSpeed" },
  ]

  return <Table columns={columns} endpoint='/api/characters' />
}