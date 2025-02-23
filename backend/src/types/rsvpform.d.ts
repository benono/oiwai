interface RsvpForm {
  status: string,
  restriction: string,
  guest: {
    name: string,
    email: string
  },
  companions: [
    {
    name: string
    }
  ],
  message: string,
  termsAccepted: boolean,
  updateUserInfo: boolean,
  updateFamilyInfo: boolean
  }

  export default RsvpForm