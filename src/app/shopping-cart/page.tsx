import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import ShoppingCartComponent from './ShoppingCartComponent'
import { prisma } from '@/lib/prisma'

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export default async function Component() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  const shoppingCart = await prisma.shoppingCart.findFirst({
    where: {
      userId: user.id
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-amber-100 p-4 sm:p-6 lg:p-8">
      <ShoppingCartComponent shoppingCart={shoppingCart} />
    </div>
  )
}