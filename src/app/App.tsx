import { useEffect } from 'react'
import { Filters, UsersList } from '@/components'
import { useUsersStore } from '@/shared/store/users'
import { classNames } from '@/shared/utils'

import '@/shared/assets/styles/style.scss'

const App = () => {

  useEffect(() => {
    useUsersStore.getState().fetchUsers()
  }, [])

  return (
    <div className={classNames('page_body', '_container')} >

      <Filters />
      
      <UsersList />

    </div>
  )
}

export default App