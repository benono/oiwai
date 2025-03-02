import { Budget, ShoppingItem } from "@/types/to-buy";
import { AxiosError } from "axios";
import { getServerAxiosInstance } from "./axios-server";

type ThingsToBuyResponse = {
  thingsToBuy: ShoppingItem[];
  budget: Budget;
};

type ThingToBuyResponse = {
  thingToBuy: { thingToBuy: ShoppingItem };
  remainBudget: Budget;
};

// Fetch things to buy
export const getThingsToBuy = async (
  eventId: string,
): Promise<ThingsToBuyResponse> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(
      `/events/${eventId}/things-to-buy`,
    );

    return {
      thingsToBuy: response.data.data.thingsToBuy,
      budget: response.data.budget,
    };
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while fetching the list.",
      );
    } else {
      throw new Error("Failed to fetch things to buy. Please try again.");
    }
  }
};

// Fetch thing to buy
export const getThingToBuy = async (
  eventId: string,
  itemId: number,
): Promise<ThingToBuyResponse> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(
      `/events/${eventId}/things-to-buy/${itemId}`,
    );

    return {
      thingToBuy: response.data.data,
      remainBudget: response.data.remainBudget,
    };
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while fetching the list.",
      );
    } else {
      throw new Error("Failed to fetch item information. Please try again.");
    }
  }
};
