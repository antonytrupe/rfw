import { SessionProvider } from 'next-auth/react';
//import { auth } from '../auth';
import ClientUI from './ClientUI';

export default async function Index() {

  //const { data: session } = useSession()
  //const session = await getServerSession( authOptions)

  //const session = await auth()

  //const session = await getServerSession(authOptions)

  // const session = await auth()
  // 
  /*
  const session = await auth()
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      //picture: session.user.picture,
    } // filter out sensitive data
  }
  /*
<SessionProvider session={session}>
</SessionProvider>
*/
  return (<>

    
      < ClientUI />
    
  </>
  )
}
