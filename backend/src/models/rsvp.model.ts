import { PrismaClient} from "@prisma/client";
import User from "./user.model"
import EventParticipants from "./eventParticipants.model"
import ParticipantRestrictions from "./participantRestrictions.model"
import UserFamilies from "./userFamilies.model"
import RsvpForm from "../types/rsvpform";

const prisma = new PrismaClient()

const submitNewUserRsvp = async (eventId: number, rsvpForm: RsvpForm, isAccepted: boolean) => {
  return await prisma.$transaction(async (tx) => {
    const newUser = await User.addNewUser(tx, rsvpForm.guest.email, rsvpForm.guest.name);
    const newParticipant = await EventParticipants.addNewEventParticipant(tx, eventId, newUser.id, isAccepted);

    if(rsvpForm.restriction.length){
      const newRestriction = await ParticipantRestrictions.addNewParticipantRestriction(tx, eventId, newUser.id, rsvpForm.restriction)
    }

    if(rsvpForm.companions.length){
      for(let i = 0; i > rsvpForm.companions.length; i++){
        await UserFamilies.addNewUserFamily(tx, newUser.id,rsvpForm.companions[i].name)
      }
    }
  
  });
};

const submitExistingUserRsvp = async (eventId: number, userId:number, rsvpForm: RsvpForm, isAccepted: boolean) => {
  return await prisma.$transaction(async (tx) => {
    const newParticipant = await EventParticipants.addNewEventParticipant(tx, eventId, userId, isAccepted);

    if(rsvpForm.restriction.length){
      const newRestriction = await ParticipantRestrictions.addNewParticipantRestriction(tx, eventId, userId, rsvpForm.restriction)
    }

    if(rsvpForm.companions.length){
      for(let i = 0; i > rsvpForm.companions.length; i++){
        await UserFamilies.addNewUserFamily(tx, userId, rsvpForm.companions[i].name)
      }
    }
  });
};

export default {
  submitNewUserRsvp,
  submitExistingUserRsvp,
  }