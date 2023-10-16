import { Config, JsonDB } from 'node-json-db';
import CommandInput from './CommandInput';

export default async function Index() {

  var db = new JsonDB(new Config("myDataBase", true, true, '/'));
  var data: string = await db.getData("/msg1");

  return (
    <CommandInput msg={data} />
  )
}
