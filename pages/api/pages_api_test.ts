import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth";


export default async function handler(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions)
  return res.json({ session })
}