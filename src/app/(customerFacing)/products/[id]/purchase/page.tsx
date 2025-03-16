import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";

//* this musst occur on the server, not on the client, because we are going to pass a secret key. Here we are "casting" in order to remove ts error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({
    where: { id },
  });
  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    //* metadata: useful to tie a purchase to a particular product
    metadata: {
      productId: product.id,
    },
  });

  //* the client_secret is used on the client to specify the paymentIntent  we are working on
  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    ></CheckoutForm>
  );
}
