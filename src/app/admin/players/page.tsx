import Table from '../Table'

export default async function Page() {

  const columns = [{ label: "Email", name: "email" },
  { label: "Claimed Characters", name: "claimedCharacters" },
  { label: "Controlled Characters", name: "controlledCharacter" },
  { label: "Max Claimed Characters", name: "maxClaimedCharacters" },
  ]

  return <Table columns={columns} endpoint='/api/players' />
}
