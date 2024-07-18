import { ReactNode, useState } from 'react'
import { useUsersStore } from '@/shared/store/users'
import { classNames } from '@/shared/utils'
import { useSortUsers } from './hooks'
import { Button } from '@/shared/UI'

import type { TUser } from '@/shared/types/user'

import c from './userList.module.scss'


export type TSort = { column: string, order: 'desc' | 'asc' } | null

export const COLUMNS_NAME = [
  { key: 'lastName', value: 'ФИО', sort: true },
  { key: 'age', value: 'Возраст', sort: true },
  { key: 'gender', value: 'Пол', sort: true },
  { key: 'address', value: 'Адрес', sort: true },
  { key: 'phone', value: 'Номер телефона', sort: false },
  { key: 'button', value: '', sort: false }
]

// Для удобства сделал отдельную переменную для вывода данных в модальном окне
const USER_DATA_KEYS = [
  { key: 'firstName', value: 'Имя' },
  { key: 'lastName', value: 'Фамилия' },
  { key: 'maidenName', value: 'Отчество' },
  { key: 'age', value: 'Возраст' },
  { key: 'gender', value: 'Пол' },
  { key: 'email', value: 'Email' },
  { key: 'phone', value: 'Номер телефона' },
  { key: 'city', value: 'Город' },
  { key: 'address', value: 'Улица' },
  { key: 'height', value: 'Рост' },
  { key: 'weight', value: 'Вес' },
]


const UsersList = () => {

  const users = useUsersStore(state => state.users)
  const loading = useUsersStore(state => state.loading)

  const [sort, setSort] = useState<TSort>(null)
  
  const sortedUsers = useSortUsers({ users, sort })

  // Меняет способ сортировки между 3 состояниями
  const sortHandler = ( column: string ) => {
    setSort(prev => {
      let order: 'desc' | 'asc' = 'asc'
      if ( prev?.column === column ) {
        if ( prev.order === 'desc' ) return null
        order = 'desc'
      }
      return {
        column,
        order
      }
    })
  }

  return (
    <div className={classNames(c.list, 'block')} >
         
        <p className='title' >Список пользователей</p>
        
        <div className={c.table} >

          <ul className={c.table_list} >
              {COLUMNS_NAME.map(column => (
                <li key={column.key} className={c.title} >
                    <p>{column.value}</p>

                    {column.value &&
                     column.sort &&
                      <button onClick={() => sortHandler( column.key )} >
                        <svg className={sort?.column === column.key ? c[sort.order] : ''} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.3" d="M6.66675 3.33331V5.33331V14.6666H5.33341V5.33331H2.66675L6.66675 1.33331V3.33331Z" fill="#236900"/>
                          <path opacity="0.3" d="M10.6666 10.6666H13.3333L9.33325 14.6666V12.6666V10.6666V1.33331H10.6666V10.6666Z" fill="#236900"/>
                        </svg>
                      </button>
                    }
                </li>
              ))}
          </ul>

          {!loading &&
            sortedUsers?.map(user => (
              <ul key={user.id} className={classNames(c.table_list, user.id % 2 === 0 ? c.grey : '')} >
                <li>{user?.lastName} {user?.firstName} {user?.maidenName}</li>
                <li>{user?.age}</li>
                <li>{user?.gender}</li>
                <li>{user?.city} {user?.address}</li>
                <li>{user?.phone}</li>
                <li>
                  <DescriptionButton user={user} >Подробнее</DescriptionButton>
                </li>
              </ul>
          ))}

          {!loading && users?.length === 0 &&
            <ul className={c.table_list}>
              <li className={c.empty_data} >Нет данных по заданному фильтру</li>
            </ul>
          }

          {loading &&
            <ul className={c.table_list}>
              <li className={classNames(c.empty_data, c.loader)} >Загрузка...</li>
            </ul>
          }

        </div>

    </div>
  )
}

interface DescriptionButtonProps {
  children: ReactNode
  user: TUser
}
const DescriptionButton = ({ children, user }: DescriptionButtonProps) => {
  
  const [active, setActive] = useState(false)

  const openModal = () => {
    setActive(true)
    const body = document.querySelector('body')
    if ( body ) body.style.overflow = 'hidden'
  }
  
  return (<>
    <Button
      className={c.description_button}
      onClick={openModal}
    >
      {children}
    </Button>
    
    {active && <Modal user={user} setActive={setActive} />}
  </>)
}

interface ModalProps {
  user: TUser
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}
const Modal = ({ user, setActive }: ModalProps) => {

  const closeModal = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    // Проверка что клик был по области вне модального окна 
    if ( e.target === e.currentTarget ) {
      closeHandler()
    }
  }

  const closeHandler = () => {
    setActive(false)
    const body = document.querySelector('body')
    if ( body ) body.style.overflow = null
  }

  return (
     <div className={c.modal} onClick={closeModal} >
        <div className={classNames(c.modal_body, 'block')} >

          <span className={c.close} onClick={closeHandler} ></span>

          <p className='title' >Подробная информация</p>

          <ul className={c.data} >
            {USER_DATA_KEYS.map(data => (
              <li key={data.key} >
                <span>{data.value}</span>
                {user[data.key as keyof TUser]}
              </li>
            ))}
          </ul>

        </div>
     </div>
  )
}

export { UsersList }