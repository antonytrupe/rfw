import { getServerSession } from 'next-auth';
 import UI from './UI';
//import { auth } from '../auth';
import { SessionProvider } from 'next-auth/react';
import { auth, authOptions } from '../auth';

export default async function Index() {

  //const { data: session } = useSession()
  //const session = await getServerSession( authOptions)

  //const session = await auth()

  //const session = await getServerSession(authOptions)

  const session= await auth()
// 
  return (
    <>
      <pre>{ session?.user?.email }</pre>
      <UI />
      {
        //<CommandInput msg={data} />
      }
    </>
  )
}
