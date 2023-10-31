import { getServerSession } from 'next-auth';
import UI from './UI';
//import { auth } from '../auth';
import { SessionProvider } from 'next-auth/react';
import { auth, authOptions } from '../auth';
import Link from 'next/link';

export default async function Index() {

  //const { data: session } = useSession()
  //const session = await getServerSession( authOptions)

  //const session = await auth()

  //const session = await getServerSession(authOptions)

  const session = await auth()
  // 
  return (
    <>
      {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>}
      {!!session?.user && <><span>Welcome {session.user.email}</span><Link href={'/api/auth/signout'}>Sign Out</Link></>}
      <UI />
      {
        //<CommandInput msg={data} />
      }
    </>
  )
}
