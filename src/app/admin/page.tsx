import Character from "@/types/Character"
 import './admin.scss'
import CharacterList from "./CharacterList"

export default async function Page() {

  async function getCharacters(): Promise<Character[]> {
    console.log('getCharacters')

    const r = await fetch('http://localhost:3000/api/characters')
    //console.log(r.json)
    return r.json()

  }

  return (<CharacterList   />
  )
}
