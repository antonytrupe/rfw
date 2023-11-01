import Link from "next/link"
import { useSession } from "next-auth/react"

export default function SignInOut() {
    const { data: session } = useSession();
    return (
        <>
            {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>
            }
            {!!session?.user && <><span>Welcome {session.user.email}</span><Link href={'/api/auth/signout'}>Sign Out</Link></>
            }
        </>
    )
}
