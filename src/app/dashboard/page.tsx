import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";
import ProductsSection from "./ProductsSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      shippingAddress: true,
    },
  });

  const lastWeekSum = await prisma.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      amount: true,
    },
  });

  return (
    <>
      <MaxWidthWrapper>
        <div className="flex min-h-[50vh] w-full">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
            <div className="flex flex-col gap-16">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Estado
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Fecha de compra
                    </TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="bg-accent">
                      <TableCell>
                        <div>{order.shippingAddress?.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {order.user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusDropdown
                          id={order.id}
                          orderStatus={order.status}
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {order.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.amount / 100)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Semana pasada</CardDescription>
                    <CardTitle className="text-4xl">
                      {" "}
                      {formatPrice((lastWeekSum._sum.amount ?? 0) / 100)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <ProductsSection />
      </MaxWidthWrapper>
    </>
  );
}
