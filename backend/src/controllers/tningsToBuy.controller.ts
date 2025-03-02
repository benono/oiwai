import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors/validation.error";
import eventModel from "../models/event.model";
import toBuyModel from "../models/thingsToBuy.model";
import Event from "../types/event";

const getThingsToBuyItems = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }
    const thingsToBuy = await toBuyModel.fetchToBuyItems(eventId);
    const result = await eventModel.fetchEventById(eventId);
    const budget = result ? result.budget : 0;

    res.status(200).json({ data: { thingsToBuy }, budget });
  } catch (err) {
    next(err);
  }
};

const getThingsToBuyItem = async (
  req: Request<{ event_id: string; item_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const itemId = Number(req.params.item_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }
    if (isNaN(itemId)) {
      throw new ValidationError("Invalid item ID");
    }
    const thingToBuy = await toBuyModel.fetchToBuyItem(itemId);
    if (!thingToBuy) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const result = await eventModel.fetchEventById(eventId);
    const budget = result ? result.budget : 0;

    const thingsToBuy = await toBuyModel.fetchToBuyItems(eventId);

    let spend = 0;
    for (let i = 0; i < thingsToBuy.length; i++) {
      if (thingsToBuy[i].isPurchase) {
        spend = spend + thingsToBuy[i].price * thingsToBuy[i].quantity;
      }
    }
    const remainBudget = budget - spend;

    res.status(200).json({ data: { thingToBuy }, budget, remainBudget });
  } catch (err) {
    next(err);
  }
};

const addThingsToBuyItemInit = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const newBudget = req.body.budget;
    const { name, price, quantity } = req.body.item;

    const result = await eventModel.addToBuyItemInit(
      eventId,
      newBudget,
      name,
      price,
      quantity,
    );

    const budget = result.updatedBudget.budget;
    const item = result.createdItem;

    res.status(200).json({ budget, item });
  } catch (err) {
    next(err);
  }
};

const updateBudget = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const newBudget = req.body.budget;
    const updates: Partial<Event> = { budget: newBudget };

    await eventModel.updateEventWithoutTransaction(eventId, updates);

    res.status(200).json({
      success: true,
      message: "updated budget successfully!",
    });
  } catch (err) {
    next(err);
  }
};

const addThingsToBuyItem = async (
  req: Request<{ event_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    }

    const { name, price, quantity } = req.body.item;

    const thingsToBuy = await toBuyModel.createToBuyItemWithoutTransaction(
      eventId,
      name,
      price,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "added item successfully!",
      data: thingsToBuy,
    });
  } catch (err) {
    next(err);
  }
};

const updateItemPurchased = async (
  req: Request<{ event_id: string; item_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const itemId = Number(req.params.item_id);
    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    } else if (isNaN(itemId)) {
      throw new ValidationError("Invalid item ID");
    }

    const isPurchased = req.body.isPurchased;

    const thingsToBuy = await toBuyModel.updateCheckForToBuyItems(
      itemId,
      isPurchased,
    );

    res.status(200).json({
      success: true,
      message: "updated checkbox successfully!",
    });
  } catch (err) {
    next(err);
  }
};

const updateThingsToBuy = async (
  req: Request<{ event_id: string; item_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const itemId = Number(req.params.item_id);

    const name = req.body.item.name;
    const price = req.body.item.price ? req.body.item.price : 0;
    const quantity = req.body.item.quantity ? req.body.item.quantity : 0;

    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    } else if (isNaN(itemId)) {
      throw new ValidationError("Invalid item ID");
    }

    const thingsToBuy = await toBuyModel.updateToBuyItems(
      itemId,
      name,
      price,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "updated checkbox successfully!",
      data: { thingsToBuy },
    });
  } catch (err) {
    next(err);
  }
};

const deleteThingsToBuy = async (
  req: Request<{ event_id: string; item_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventId = Number(req.params.event_id);
    const itemId = Number(req.params.item_id);

    // Validate ID
    if (isNaN(eventId)) {
      throw new ValidationError("Invalid event ID");
    } else if (isNaN(itemId)) {
      throw new ValidationError("Invalid item ID");
    }

    await toBuyModel.deleteToBuyItems(itemId);

    res.status(200).json({
      success: true,
      message: "deleted item successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getThingsToBuyItems,
  getThingsToBuyItem,
  addThingsToBuyItemInit,
  updateBudget,
  addThingsToBuyItem,
  updateItemPurchased,
  updateThingsToBuy,
  deleteThingsToBuy,
};
