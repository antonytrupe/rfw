import Link from "next/link"
import { useSession } from "next-auth/react"

export default function SignInOut() {
    const { data: session } = useSession();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '4px' }}>
            {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>}
            {!!session?.user && <><span style={{}}>{session.user.email}</span>
                <Link href={'/api/auth/signout'} style={{border:' thin black solid', borderRadius:'6px'}}>Sign Out</Link></>}
        </div>
    )
}
