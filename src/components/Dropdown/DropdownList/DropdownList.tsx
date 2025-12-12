import type React from 'react'
import styles from './DropdownList.module.scss'
import {
  createRef,
  useEffect,
  useRef,
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type SetStateAction,
} from 'react'
import type { Option } from '../Dropdown'

interface Props {
  options: Option[]
  menuRef: React.RefObject<HTMLUListElement | null>
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  style?: CSSProperties
}

export default function DropdownList({
  options = [],
  menuRef,
  setIsOpen,
  style = {},
}: Props) {
  const optionRefs = useRef<RefObject<HTMLButtonElement>[]>([])

  optionRefs.current = options.map(
    (_, i) => optionRefs.current[i] || createRef<HTMLButtonElement>()
  )

  const handleSelect = (e: MouseEvent<HTMLButtonElement>, option: Option) => {
    option.onClick?.(e)
    setIsOpen(false)
  }

  useEffect(() => {
    const firstItem = optionRefs.current[0].current
    if (!firstItem) return

    setTimeout(() => {
      firstItem.focus()
    }, 1)
  }, [])

  const handleKeyEvent = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const length = optionRefs.current.length

    if (e.key === 'ArrowUp') {
      const target = optionRefs.current.at(idx - 1)
      target?.current.focus()
      e.preventDefault()
    }

    if (e.key === 'ArrowDown') {
      const target = optionRefs.current[idx >= length - 1 ? 0 : idx + 1]
      target?.current.focus()
      e.preventDefault()
    }
  }

  return (
    <ul
      className={styles.menu}
      ref={menuRef}
      style={{ ...style, position: 'absolute' }}
    >
      {options.map((option, idx) => (
        <li key={idx} className={styles.dropdownItem}>
          <button
            ref={optionRefs.current[idx]}
            tabIndex={0}
            className={styles.button}
            onClick={(e) => handleSelect(e, option)}
            onKeyDown={(e) => handleKeyEvent(e, idx)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
