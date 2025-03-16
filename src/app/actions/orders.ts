"use server";

import db from "@/db/db";

export async function userOrderExists(email: string, productId: string) {
  //* we are checking for the order, making sure it exists for a specific email and product and that  it's not equal to null
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  );
}
