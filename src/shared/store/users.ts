import { create } from "zustand"
import { devtools } from 'zustand/middleware'
import { fetchData } from "../utils"

import type { TUser } from "../types/user"
import type { TQueryUsersResponse } from "../types/api"


export type TFilters = {
  key: string
  value: string
}


interface TUsersState {
  users: TUser[]
  loading: boolean
}

interface TUsersStore extends TUsersState {
	fetchUsers: () => Promise<void>
  queryUsersWithFilter: (obj: Partial<TFilters>) => Promise<void>
}

const initialState: TUsersState = {
  users: [],
  loading: false
}

// Данные о пользователе, которые нужно запросить
const dataToQuery = ['firstName', 'lastName', 'maidenName', 'age', 'gender', "phone", "address", "weight", "height", "email"]

export const useUsersStore = create(
	devtools<TUsersStore>((set) => ({
		...initialState,

		fetchUsers: async () => {
			
      set({ loading: true })
      try {

        // Создал отдельную функцию fetchData для удобства и работы типизации
        const data = await fetchData<TQueryUsersResponse>('https://dummyjson.com/users?select='+dataToQuery.join(','))

        // Разбивается обьект address на два отдельных ключа
        const users = data.users.reduce<TUser[]>((acc, user) => {
          const { address, ...userData } = user
          acc.push({
            ...userData,
            address: address.address,
            city: address.city
          })
          return acc
        }, [])

        set({ users })
      } catch (err) {
        throw new Error(err)
      }
      finally {
        set({ loading: false })
      }
		},

    queryUsersWithFilter: async ( filter ) => {
      set({ loading: true })
      try {
        const key = filter.key === 'city' ? 'key=address.city' : `key=${filter.key}`
        const value = `value=${filter.value}`

        const data = await fetchData<TQueryUsersResponse>(`https://dummyjson.com/users/filter?${key}&${value}&select=${dataToQuery.join(',')}`)

        const users = data.users.reduce<TUser[]>((acc, user) => {
          const { address, ...userData } = user
          acc.push({
            ...userData,
            address: address.address,
            city: address.city
          })
          return acc
        }, [])

        set({ users })
      } catch (err) {
        throw new Error(err)
      }
      finally {
        set({ loading: false })
      }
    },

	}))
)