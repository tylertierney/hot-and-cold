import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEventHandler,
  type CSSProperties,
  useLayoutEffect,
  useCallback,
  type PropsWithChildren,
} from 'react'
import DropdownList from './DropdownList/DropdownList'
import Button from '../Button/Button'

export interface Option {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

interface Props {
  options: Option[]
  placeholder?: string
  style?: React.CSSProperties
}

export default function Dropdown({
  options,
  style = {},
  children,
}: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuStyles, setMenuStyles] = useState<CSSProperties>({})
  const menuRef = useRef<HTMLUListElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useLayoutEffect(() => {
    if (!isOpen) return

    const trigger = triggerRef.current
    const menu = menuRef.current

    if (!menu || !trigger) return

    const listener = ({ target }: PointerEvent) => {
      if (!target) return
      const _target = target as Node
      if (!menu.contains(_target) && !trigger.contains(_target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('click', listener)

    return () => window.removeEventListener('click', listener)
  }, [isOpen])

  const setMenuPosition = useCallback(() => {
    if (!isOpen) return

    const trigger = triggerRef.current
    const menu = menuRef.current

    if (!trigger || !menu) return

    const triggerRect = trigger.getBoundingClientRect()
    const {
      width: triggerWidth,
      height: triggerHeight,
      top: triggerTop,
      left: triggerLeft,
    } = triggerRect

    const menuRect = menu.getBoundingClientRect()
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const menuWidth = menuRect.width + 10
    const menuHeight = menuRect.height + 10
    const halfMenuWidth = ~~(menuWidth / 2)
    const halfTriggerWidth = ~~(triggerWidth / 2)

    // calculate top
    if (triggerTop + triggerHeight + menuHeight >= screenHeight) {
      setMenuStyles((prev) => ({
        ...prev,
        top: `${triggerTop - menuHeight}px`,
      }))
    } else {
      setMenuStyles((prev) => ({
        ...prev,
        top: `${triggerTop + triggerHeight + 10}px`,
      }))
    }

    // calculate left
    if (triggerLeft - menuWidth < 10) {
      setMenuStyles((prev) => ({
        ...prev,
        left: 10,
      }))
    } else if (triggerLeft + menuWidth + 10 > screenWidth) {
      setMenuStyles((prev) => ({
        ...prev,
        left: screenWidth - menuWidth - 10,
      }))
    } else {
      setMenuStyles((prev) => ({
        ...prev,
        left: `${triggerLeft + halfTriggerWidth - halfMenuWidth}px`,
      }))
    }

    setMenuStyles((prev) => ({
      ...prev,
      zIndex: 1000,
    }))
  }, [isOpen])

  useEffect(() => {
    setMenuPosition()
  }, [isOpen, setMenuPosition])

  const resizeListener = useCallback(() => {
    if (isOpen) {
      setMenuPosition()
    }
  }, [isOpen, setMenuPosition])

  useEffect(() => {
    window.addEventListener('resize', resizeListener)

    return () => window.removeEventListener('resize', resizeListener)
  }, [resizeListener])

  return (
    <>
      <Button
        style={style}
        onClick={() => setIsOpen((prev) => !prev)}
        ref={triggerRef}
      >
        {children}
      </Button>
      {isOpen && (
        <DropdownList
          options={options}
          menuRef={menuRef}
          style={menuStyles}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  )
}
