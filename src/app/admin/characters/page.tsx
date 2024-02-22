import Table from "../DataTable"

export default async function Page() {
  const columns = [
    { label: "Name", name: "name" },
    { label: "ID", name: "id" },
    { label: "Controlled By", name: "playerId" },
    { label: "Location", name: "location" },
    { label: "Level", name: "level" },
    { label: "Class", name: "characterClass" },
    { label: "Race", name: "race" },
    { label: "Max HP", name: "maxHp" },
    { label: "HP", name: "hp" },
    { label: "Current Speed", name: "speed" },
    { label: "Walk Speed", name: "maxSpeed" },
    { label: "Rotation Acceleration", name: "rotationAcceleration" },
    { label: "Acceleration", name: "speedAcceleration" },
    { label: "Actions", name: "actions" },
  ]

  return <Table columns={columns} endpoint='/api/characters' />
}