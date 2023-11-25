import { CHARACTER_PATH } from "@/types/CONSTANTS"
import Character from "@/types/Character"
import { Config, JsonDB } from "node-json-db"
import { Suspense } from "react"

export default async function Page() {

  async function getCharacters() {
    //console.log('getCharacters')
    const worldDB = new JsonDB(new Config("data/world", true, true, '/'))

    await worldDB.load()

    return await worldDB.getObject<{}>(CHARACTER_PATH).then((charactersJSON) => {
      //console.log('then')
      const characters: Character[] = []

      Object.entries(charactersJSON).map(([id, character]: [id: string, character: any]) => {
        characters.push(character)
      })
      return characters
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <div className="table">
      <div className="table-row">
        <span className="table-cell">Name</span>
        <span className="table-cell">Level</span>
        <span className="table-cell">Class</span>
        <span className="table-cell">Race</span>
      </div>
      <div className="table-column-group">
        <div className="table-colum">Name</div>
        <div className="table-colum">Level</div>
        <div className="table-colum">Class</div>
        <div className="table-colum">Race</div>
      </div>
      <Suspense fallback={<span>loading</span>}>
        {(await getCharacters())?.map((character) => {
          return (
            <div className="table-row" key={character.id}>
              <span className="table-cell">{ }</span>
              <span className="table-cell">{character.level}</span>
              <span className="table-cell">{character.characterClass}</span>
              <span className="table-cell">{character.race}</span>
            </div>)
        })
        }
      </Suspense>
    </div>
  )
}
