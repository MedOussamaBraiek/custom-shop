import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";
import { useState } from "react";
import Image from "next/image";
import DashboardPage from "./AdminDashboard";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  const orders = await db.order.findMany({
    where: {
      isPaid: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        // last week
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      configuration: true,
      // shippingAddress: true,
    },
  });

  // console.log(orders);

  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        // last week
      },
    },
    _sum: {
      amount: true,
    },
  });

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        // last week
      },
    },
    _sum: {
      amount: true,
    },
  });

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2000;

  return (
    <DashboardPage
      orders={orders}
      lastWeekSum={lastWeekSum}
      lastMonthSum={lastMonthSum}
    />
  );
};

export default page;
