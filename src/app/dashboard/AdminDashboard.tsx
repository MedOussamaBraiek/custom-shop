"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import StatusDropdown from "./StatusDropdown";
import { useState } from "react";
import Image from "next/image";
import {
  OrderStatus,
  ProductColor,
  ProductType,
  ShirtSize,
} from "@prisma/client";

interface User {
  id: string;
  email: string;
}

interface Configuration {
  id: string;
  productType?: ProductType | null;
  uploadedImage: string;
  resultImage: string;
  size?: ShirtSize | null;
  color?: ProductColor | null;
  amount?: number | null;
}

interface Order {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  amount: number;
  shippingAddress?: string | null;
  status: OrderStatus;
  user: User;
  configuration: Configuration;
  configurationId: string;
}

interface AggregateSum {
  _sum: {
    amount: number | null;
  };
}

interface DashboardPageProps {
  orders: Order[];
  lastWeekSum: AggregateSum;
  lastMonthSum: AggregateSum;
}

const DashboardPage = ({
  orders,
  lastWeekSum,
  lastMonthSum,
}: DashboardPageProps) => {
  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2000;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => setSelectedImage(image);

  const closeModal = () => setSelectedImage(null);

  return (
    <div className="flex min-h-screen w-full bg-muted/40 px-2">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4 ">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className=" sm:table-cell">Status</TableHead>
                <TableHead className=" sm:table-cell">Products</TableHead>
                <TableHead className=" sm:table-cell">Images</TableHead>
                <TableHead className=" sm:table-cell">Purchase date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress
                        ? order.shippingAddress
                        : "No address provided"}
                    </div>
                    <div className=" text-sm text-muted-foreground md:inline">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell className=" sm:table-cell">
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>
                  <TableCell className=" sm:table-cell">
                    {order.configuration?.productType}
                  </TableCell>
                  <TableCell className=" sm:table-cell">
                    <div className="flex gap-2 overflow-x-auto max-w-[150px]">
                      {/* Uploaded Image */}
                      <Image
                        src={order.configuration?.uploadedImage}
                        alt="Uploaded Image"
                        width={40}
                        height={40}
                        className="cursor-pointer object-contain"
                        onClick={() =>
                          openModal(order.configuration?.uploadedImage)
                        }
                      />
                      {/* Result Image */}
                      <Image
                        src={order.configuration?.resultImage}
                        alt="Result Image"
                        width={40}
                        height={40}
                        className="cursor-pointer object-contain"
                        onClick={() =>
                          openModal(order.configuration?.resultImage)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className=" sm:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Modal for viewing larger images */}
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="Selected Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 text-white"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export this as a Client Component
export default DashboardPage;
