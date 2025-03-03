import { auth } from "@/src/auth"
import { LogoutButton } from "@/src/components/ui/logoutButton"

export default async function GetUser() {
   const session = await auth()

   if (!session) {
      return <div>Not authenticated</div>
   }

   return (
      <>
         {JSON.stringify(session, null, 2)}

         <LogoutButton />
      </>
   )
}