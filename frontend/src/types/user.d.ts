export type UserType = {
  user:{
    id: string,
    name: string,
    email: string,
    family: { id: string, name: string }[]
  }
}
