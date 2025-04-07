const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Invitation URL
export const getInvitationUrl = (eventId: string) =>
  `${baseUrl}/rsvp/${eventId}`;
