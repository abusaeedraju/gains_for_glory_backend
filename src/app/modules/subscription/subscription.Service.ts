import { StatusCodes } from "http-status-codes";
import { stripe } from "../../../config/stripe";
import ApiError from "../../error/ApiErrors";
import { prisma } from "../../../utils/prisma";

const createSubscriptionIntoDB = async (payload: any) => {
  const createProductId = await stripe.products.create({
    name: payload.name,
    description: payload.description || "",
  });

  if (!createProductId.id) {
    throw new ApiError(
      StatusCodes.EXPECTATION_FAILED,
      "Failed to create a product"
    );
  }

  const createPriceInStripe = await stripe.prices.create({
    unit_amount: Math.ceil(payload.price * 100),
    currency: payload.currency || "usd",
    recurring: {
      interval: payload.interval || "month",
      interval_count: payload.interval_count || 1,
    },
    product: createProductId.id,
  });

  

  if (!createPriceInStripe.id) {
    throw new ApiError(
      StatusCodes.EXPECTATION_FAILED,
      "Failed to create a price"
    );
  }

  const subscription = await prisma.subscription.create({
    data: {
      name: payload.name,
      stripePriceId: createPriceInStripe.id,
      stripeProductId: createProductId.id,
      price: payload.price,
      description: payload.description,
      currency: payload.currency,
      interval: payload.interval,
      interval_count: payload?.interval_count,
    },
  });

  return subscription;
};

const updateSubscriptionIntoDB = async (id: string, payload: any) => {
  const subscriptionPlan = await prisma.subscription.findUnique({
    where: { id },
  });
  const newAmount = Math.ceil(payload.price * 100);

  if (!subscriptionPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found");
  }

  const stopOldPrice = await stripe.prices.update(
    subscriptionPlan.stripePriceId,
    {
      active: false,
    }
  );

  if (!stopOldPrice.id) {
    throw new ApiError(
      StatusCodes.EXPECTATION_FAILED,
      "Failed to update a price"
    );
  }

  const newPrice = await stripe.prices.create({
    product: subscriptionPlan.stripeProductId,
    unit_amount: newAmount, // e.g., 3000 for $30.00
    currency: subscriptionPlan.currency || "usd",
    recurring: {
      interval: payload.interval || "month",
      interval_count: payload.interval_count || 1,
    },
  });

  if (!newPrice.id) {
    throw new ApiError(
      StatusCodes.EXPECTATION_FAILED,
      "Failed to create a price"
    );
  }

  const subscription = await prisma.subscription.update({
    where: {
      id,
    },
    data: {
      price: payload.price,
      interval: payload.interval,
      stripePriceId: newPrice.id,
      description: payload.description,
      currency: payload.currency,
      },
  });
  return subscription;
};

const deleteSubscriptionIntoDB = async (id: string) => {
  const subscriptionPlan = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!subscriptionPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Subscription not found");
  }

  const deletedProduct = await stripe.products.update(
    subscriptionPlan.stripeProductId,
    {
      active: false,
    }
  );

  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      status: "BLOCKED",
    },
  });
  return subscription;
};

const getAllSubscriptionsFromDB = async (id: string) => {
  const findUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  const subscriptions = await prisma.subscription.findMany();

  return subscriptions;
};

export const subscriptionService = {
  createSubscriptionIntoDB,
  updateSubscriptionIntoDB,
  deleteSubscriptionIntoDB,
  getAllSubscriptionsFromDB,
};
