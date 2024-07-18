import { useState } from 'react'
import { classNames } from '@/shared/utils'
import { Button, Input } from '@/shared/UI'
import { useUsersStore } from '@/shared/store/users'

import c from './filters.module.scss'

// Использовал enum т.к. ключи используются в нескольких местах
const enum EFilters {
  firstName='firstName',
  lastName='lastName',
  maidenName='maidenName',
  age='age',
  gender='gender',
  phone='phone',
  city='city',
}

// Доступные фильтры для выбора в выпадающем списке
const FILTERS = [
  { key: EFilters.firstName, value: 'Имя' },
  { key: EFilters.lastName, value: 'Фамилия' },
  { key: EFilters.maidenName, value: 'Отчество' },
  { key: EFilters.age, value: 'Возраст' },
  { key: EFilters.gender, value: 'Пол' },
  { key: EFilters.phone, value: 'Номер телефона' },
  { key: EFilters.city, value: 'Город' },
]


const Filters = () => {

  const [activeSelect, setActiveSelect] = useState(0)

  const [filter, setFilter] = useState(FILTERS[0])
  const [value, setValue] = useState('')

  // Выключает все выпадающие списки при onSubmit
  const applyHandler = () => {
    setActiveSelect(0)
  }

  // Сброс фильтров
  const clearHandler = () => {
    useUsersStore.getState().fetchUsers()
    setValue('')
  }

  const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    useUsersStore.getState().queryUsersWithFilter({
      key: filter.key,
      value
    })
  }

  return (
      <div className={classNames(c.filters, 'block')} >
         
         <p className='title' >Фильтры</p>

         <form onSubmit={onSubmit} >

            <Select
              label='Искать по:'
              filter={filter}
              setFilter={setFilter}
              setValue={setValue}
              active={activeSelect === 1}
              setActive={() => setActiveSelect(prev => prev === 1 ? 0 : 1)}
            />

            {(
              filter.key === EFilters.firstName ||
              filter.key === EFilters.lastName ||
              filter.key === EFilters.maidenName ||
              filter.key === EFilters.city
            ) &&
              <TextField value={value} setValue={setValue} />
            }

            {filter.key === EFilters.phone &&
              <PhoneField value={value} setValue={setValue} />
            }

            {filter.key === EFilters.age &&
              <AgeField value={value} setValue={setValue} />
            }

            {filter.key === EFilters.gender &&
              <SelectGender
                value={value}
                setValue={setValue}
                active={activeSelect === 2}
                setActive={() => setActiveSelect(prev => prev === 2 ? 0 : 2)}
              />
            }

            <Button onClick={applyHandler} >Применить</Button>
            <Button type='button' onClick={clearHandler} >Сбросить</Button>
         </form>

      </div>
   )
}


interface SelectProps {
  label: string
  filter: { key: string, value: string }
  setValue: React.Dispatch<React.SetStateAction<string>>
  setFilter: React.Dispatch<React.SetStateAction<{ key: string, value: string }>>
  active: boolean
  setActive: () => void
}
const Select = ({ label, filter, setValue, setFilter, active, setActive }: SelectProps) => {

   const handleChange = ( column: { key: string, value: string } ) => {
      setFilter(column)
      setValue('')
      setActive()
   }

   return (
      <div className={c.select_wrapper} >

         <p className={c.label} >{label}</p>

         <div className={classNames(c.select, active ? c._active : '')} >

            <div className={classNames(c.value, active ? c._active : '')} onClick={setActive} >{filter.value}</div>

            <div className={classNames(c.select_body, active ? c._active : '')} >

               <div className={c.select_items_wrapper}>
                  {FILTERS.map((column, index) => (
                     <div
                        key={index}
                        className={filter.key === column.key ? c._active : ''}
                        onClick={() => handleChange(column)}
                     >
                        {column.value}
                     </div>
                  ))}
               </div>

            </div>

         </div>
      </div>
   )
}

interface TextFieldProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}
const TextField = ({ value, setValue }: TextFieldProps) => {
  return (
    <Input
      type='text'
      maxLength={100}
      onChange={e => setValue(e.target.value)}
      value={value}
    />
  )
}

interface PhoneFieldProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}
const PhoneField = ({ value, setValue }: PhoneFieldProps) => {

  const onChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setValue(e.target.value.replace(/[^0-9\s\+\-]/g, ''))
  }

  return (
    <Input
      type='tel'
      maxLength={20}
      onChange={onChange}
      value={value}
    />
  )
}

interface SelectGenderProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  active: boolean
  setActive: () => void
}
const SelectGender = ({ value, setValue, active, setActive }: SelectGenderProps) => {

   const genders = ['male', 'female']

   const handleChange = ( gender: string ) => {
      setValue(gender)
      setActive()
   }

   return (
    <div className={classNames(c.select, active ? c._active : '')} >

      <div
        className={classNames(c.value, active ? c._active : '')}
        onClick={setActive}
      >
        {value}
      </div>

      <div className={classNames(c.select_body, active ? c._active : '')} >

        <div className={c.select_items_wrapper}>
            {genders.map((gender, index) => (
              <div
                  key={index}
                  className={value === gender ? c._active : ''}
                  onClick={() => handleChange(gender)}
              >
                  {gender}
              </div>
            ))}
        </div>

      </div>

  </div>
   )
}

interface AgeFieldProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}
const AgeField = ({ value, setValue }: AgeFieldProps) => {
  return (
    <Input
      type='text'
      maxLength={3}
      onChange={e => setValue(e.target.value.replace(/[^0-9]/g, ''))}
      value={value}
    />
  )
}

export { Filters }