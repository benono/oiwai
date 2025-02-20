export type ResponseType = {
    status: "ACCEPT" | "DECLINE",
    restriction: string,
    guest: {
      name: string,
      email: string,
    },
    companions: { name: string }[],
    message: strin,
    termsAccepted: boolean,
    updateUserInfo: boolean,
    updateFamilyInfo: boolean,
  }

