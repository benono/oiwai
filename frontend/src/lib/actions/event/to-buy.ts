"use server";

import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { Budget, Item } from "@/types/to-buy";
import { AxiosError } from "axios";

// Create things to buy
export const createThingsToBuy = async ({
  eventId,
  budget,
  requestData,
}: {
  eventId: string;
  budget: Budget;
  requestData: Item;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.post(
      `/events/${eventId}/things-to-buy/init`,
      {
        budget: budget,
        item: requestData,
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to create things to buy. Please try again.");
    }
  }
};

// Add item
export const addItem = async ({
  eventId,
  requestData,
}: {
  eventId: string;
  requestData: Item;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.post(
      `/events/${eventId}/things-to-buy`,
      {
        item: requestData,
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to add item. Please try again.");
    }
  }
};

// Update purchase status
export const updatePurchaseStatus = async ({
  eventId,
  item_id,
  isPurchased,
}: {
  isPurchased: boolean;
  eventId: string;
  item_id: string;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.patch(
      `/events/${eventId}/things-to-buy/${item_id}/is-purchased`,
      { isPurchased },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new AxiosError(
        "Failed to update purchase status. Please try again.",
      );
    }
  }
};

// Update item
export const updateItem = async ({
  eventId,
  item_id,
  requestData,
}: {
  eventId: string;
  item_id: string;
  requestData: Item;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.put(
      `/events/${eventId}/things-to-buy/${item_id}`,
      {
        item: requestData,
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new AxiosError("Failed to update item. Please try again.");
    }
  }
};

// Update budget
export const updateBudget = async ({
  eventId,
  budget,
}: {
  eventId: string;
  item_id: string;
  budget: Budget;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.patch(
      `/events/${eventId}/things-to-buy/budget`,
      { budget },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new AxiosError("Failed to update budget. Please try again.");
    }
  }
};

// Delete item
export const deleteItem = async (
  eventId: string,
  item_id: number,
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.delete(
      `events/${eventId}/things-to-buy/${item_id}`,
    );

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error("Failed to delete item. Please try again.");
    }
  }
};
