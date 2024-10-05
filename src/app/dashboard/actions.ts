"use server"

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";

export const changeOrderStatus = async (
    {id , newStatus} : {id: string, newStatus: OrderStatus}) => {

        await db.order.update({
            where: {id: id},
            data: {
                status: newStatus
            }
        })
}

export const deleteOrder = async (id: string) => {
    try {
      await db.order.delete({
        where: { id: id },
      });
      return { success: true, message: "Order deleted successfully" };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, message: "Failed to delete order" };
    }
  };