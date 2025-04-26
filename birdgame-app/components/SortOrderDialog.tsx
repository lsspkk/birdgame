import React from 'react'
import Dialog from './basic/Dialog'
import { Button } from './basic/Button'

export type OrderType =
  | 'image-known'
  | 'image-unknown'
  | 'audio-known'
  | 'audio-unknown'

interface SortOrderDialogProps {
  open: boolean
  onClose: () => void
  order: OrderType
  setOrder: (order: OrderType) => void
}

const options = [
  { value: 'image-known', label: 'Osatut kuvat' },
  { value: 'image-unknown', label: 'Ei osatut kuvat' },
  { value: 'audio-known', label: 'Osatut äänet' },
  { value: 'audio-unknown', label: 'Ei osatut äänet' },
] as const

export default function SortOrderDialog({
  open,
  onClose,
  order,
  setOrder,
}: SortOrderDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Järjestä linnut"
      buttons={<Button onClick={onClose}>Sulje</Button>}
    >
      <form className="flex flex-col gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-lg"
          >
            <input
              type="radio"
              name="order"
              value={opt.value}
              checked={order === opt.value}
              onChange={() => setOrder(opt.value)}
              className="accent-blue-600"
            />
            {opt.label}
          </label>
        ))}
      </form>
    </Dialog>
  )
}
