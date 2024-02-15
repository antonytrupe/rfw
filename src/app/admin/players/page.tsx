import DataTable from '../DataTable'

export default async function Page() {

  const columns = [{ label: "Email", name: "email" },
  { label: "Claimed Characters", name: "claimedCharacters" },
  { label: "Controlled Character", name: "controlledCharacter" },
  { label: "Max Claimed Characters", name: "maxClaimedCharacters" },
  { label: "Quests", name: "quests" },
  ]

  return <DataTable columns={columns} endpoint='/api/players' />
}
