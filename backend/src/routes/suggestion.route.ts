import { Router } from "express";
import venueSuggestionController from "../controllers/venue-suggestion.controller";

const suggestionRouter = Router();

suggestionRouter.post("/venue", venueSuggestionController.getVenueSuggestions);

export default suggestionRouter;
