//import NextAuth from "next-auth"
 //export const { handlers, auth } = NextAuth({ providers: [GitHub] })


import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID || '',
            clientSecret: process.env.AUTH_GITHUB_SECRET || '',
        }),
          GoogleProvider({
           clientId: process.env.AUTH_GOOGLE_ID || '',
           clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
         }), 
    ]
} 

export async function getServerSideProps(context: any) {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
        },
    }
}

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, authOptions)
}