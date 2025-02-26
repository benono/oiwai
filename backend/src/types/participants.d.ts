interface ParticipantWithUser {
  id: number;
  name: string;
  profileImageUrl: string;
  messageToHost: string;
  restrictionNote: string;
  isAccepted: boolean;
  isAttended: boolean;
}

export default ParticipantWithUser;
