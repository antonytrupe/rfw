import { Config, JsonDB } from 'node-json-db';
import CommandInput from './CommandInput';
import Canvas from '@/Canvas';


export default async function Index() {

  var db = new JsonDB(new Config("myDataBase", true, true, '/'));
  var data: string = await db.getData("/msg1");

  let x = 55, y = 66

   
     
  /*

 <Canvas inputHandler={async () => {
        "use server"
      }} />

  */

  return (
    <>
      <Canvas   />
      {
      //<CommandInput msg={data} />
      }
    </>
  )
}
