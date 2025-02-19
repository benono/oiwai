export type ResponseType = {
  response: {
    status: "ACCEPT" | "DECLINE",
    restriction: string,
    guest: {
      name: string,
      email: string
    },
    companions: { name: string }[],
    message: string,
    termsAccepted: boolean,
    updateUserInfo: boolean,
    updateFamilyInfo: boolean
  }
}
