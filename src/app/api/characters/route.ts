import { CHARACTER_KIND } from "@/types/CONSTANTS"
import Character from "@/types/Character"
import { Datastore } from "@google-cloud/datastore"
import { NextResponse } from "next/server"

//force-dynamic
export const dynamic = 'force-dynamic'

export async function GET() {
    const datastore = new Datastore({ projectId: 'rfw2-403802' })

    const characterQuery = datastore.createQuery(CHARACTER_KIND)

    let characters: Character[] | any[] | undefined

    characters = await datastore.runQuery(characterQuery)
        .then(([c]) => {
            characters = c
            console.log('finished loading characters admin')
            return c
        })

    return NextResponse.json(characters)
}


export async function DELETE(request: Request) {
    console.log('delete characters')
    const res = await request.json()
    console.log(res)
    const datastore = new Datastore({ projectId: 'rfw2-403802' })

    datastore.delete(res.map((id) => datastore.key([CHARACTER_KIND, id])))

    return NextResponse.json({ message: 'delete stub' })
}
