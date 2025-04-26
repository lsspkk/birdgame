import React, { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  buttons?: ReactNode
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
  buttons,
}: DialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className={`
          h-full
           bg-white rounded-md shadow-lg w-full max-w-md  p-6 md:p-8 z-10
          md:rounded-xl md:max-w-lg md:h-auto md:max-h-[90vh]
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto text-gray-700"
          style={{
            // On md+ (tablet/desktop), let content determine height, but scroll if too tall
            height: 'auto',
            maxHeight: 'calc(100vh - 4rem)', // leave space for padding/header
          }}
        >
          {children}
        </div>
        {buttons && (
          <div className="flex flex-row justify-end">
            {/* Desktop: show at bottom of dialog */}
            <div className="hidden md:flex mt-6 pt-4  border-gray-200 dark:border-gray-700 justify-end gap-2">
              {buttons}
            </div>
            {/* Mobile: fixed at bottom of viewport */}
            <div className="fixed md:hidden left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-900 px-4 py-3 flex justify-end gap-2">
              {buttons}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
