import { Config, JsonDB } from 'node-json-db';
import CommandInput from './CommandInput';
import Canvas from '@/Canvas';


export default async function Index() {

  var db = new JsonDB(new Config("myDataBase", true, true, '/'));
  var data: string = await db.getData("/msg1");

  let x = 55, y = 66

  const inputHandler = async (code: string) => {
    "use server"

    console.log('document keydown even handler', code);
    if (code == 'KeyD') {
      x += 1
      //draw()
    }
    else if (code == 'KeyA') {
      x -= 1
      //draw()
    }
    else if (code == 'KeyS') {
      y += 1
      //draw()
    }
    else if (code == 'KeyW') {
      y -= 1
      //draw()
    }

    return {x,y}

  }

  /*

 <Canvas inputHandler={async () => {
        "use server"
      }} />

  */

  return (
    <>
      <Canvas inputHandler={inputHandler} />
      <CommandInput msg={data} />
    </>
  )
}
