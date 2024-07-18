import { useEffect, useState } from "react"

import type { TUser } from "@/shared/types/user"
import type { TSort } from "../UsersList"

interface SortUsersProps {
  users: TUser[]
  sort: TSort
}
export const useSortUsers = ({ users, sort }: SortUsersProps): TUser[] => {

  const [sortedUsers, setSortedUsers] = useState([])

  // Обновляется состояние sortedUsers, когда приходят данные с сервера
  useEffect(() => {
    // structuredClone используется, чтобы при последующей сортировке методом sort не мутировался исходный массив
    setSortedUsers(structuredClone(users))
  }, [users])

  // При изменении способа сортировки обновляется sortedUsers
  useEffect(() => {

    if ( sort ) {
      setSortedUsers(prev => {
        const sorted = prev.sort((a, b) => {
          const currentUserVal = a[sort.column as keyof TUser]
          const nextUserVal = b[sort.column as keyof TUser]
          if ( currentUserVal > nextUserVal ) return 1
          if ( currentUserVal < nextUserVal ) return -1
          return 0
        })

        // Использовал спред оператор т.к. useState требует новую ссылку на массив
        return sort.order === 'asc' ? [...sorted] : [...sorted.reverse()]
      })
    }
    else {
      setSortedUsers(structuredClone(users))
    }

  }, [sort])

  return sortedUsers

}