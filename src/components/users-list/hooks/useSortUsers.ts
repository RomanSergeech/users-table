import { useEffect, useState } from "react"

import type { TUser } from "@/shared/types/user"
import type { TSort } from "../UsersList"

interface SortUsersProps {
  users: TUser[]
  sort: TSort
}
export const useSortUsers = ({ users, sort }: SortUsersProps): TUser[] => {

  const [sortedUsers, setSortedUsers] = useState([])

  useEffect(() => {
    setSortedUsers(structuredClone(users))
  }, [users])

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
        
        return sort.order === 'asc' ? [...sorted] : [...sorted.reverse()]
      })
    }
    else {
      setSortedUsers(structuredClone(users))
    }
  }, [sort])

  return sortedUsers

}