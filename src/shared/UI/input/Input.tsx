import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react'
import { classNames } from '@/shared/lib/utils'

import c from './input.module.scss'

type IInputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(( { className, ...props }: IInputProps, ref: ForwardedRef<HTMLInputElement> ) => {
   return (
    <input
      className={classNames(className, c.input )}
      {...props}
      ref={ref}
    />
   )
})
