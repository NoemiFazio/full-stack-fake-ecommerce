//* Here there will be web hooks related to stripe.
//* This will be called by stripe when we'll have a successful payment, this is way more secure
//* for more info on Stripe Cli, look into your personal notes

import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

//* this POST  is important in order to avoid someone using this endpoint maliciously
export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product == null || email == null) {
      return new NextResponse("Bad Request", {
        status: 400,
      });
    }

    //* we want to create/update a user by adding an order to them

    //* if the email already exists in the database, it will add a new order for that user, if it doesn't exist it will create a new user with that email and it will add thet order to them
    const userFields = {
      email,
      orders: {
        create: {
          productId,
          pricePaidInCents,
        },
      },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: {
        email,
      },
      create: userFields,
      update: userFields,
      select: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    //*  we want to send an email to the user saying they  made the purchase + a download link, now we're going to set up the information for that as well
    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 100 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: <h1>Hi</h1>,
    });
  }
  return new NextResponse();
}
