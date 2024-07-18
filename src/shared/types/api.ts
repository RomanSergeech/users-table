import { TUser } from "./user"

interface TUserResponse extends Omit<TUser, 'address'> {
  address: {
    address: string
    city: string
  }
}

export type TQueryUsersResponse = {
  users: TUserResponse[]
  total: number
  skip: number
  limit: number
}