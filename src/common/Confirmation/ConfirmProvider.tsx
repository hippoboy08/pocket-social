import { DialogProps } from '@material-ui/core'
import React from 'react'
import { ConfirmContext, ConfirmOptions } from '.'
import ConfirmDialog from './ConfirmDialog'

const defaultConfirmOptions: ConfirmOptions = {
  title: 'Do you confirm to do this?',
  description: 'This is an important action',
  confirmText: 'Confirm',
  dismissText: 'Dismiss',
  dialogProps: {} as DialogProps,
  confirmButtonProps: {},
  dismissButtonProps: {},
}

interface ConfirmProviderProps {
  children: React.ReactNode
}
const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [actions, setActions] = React.useState<Function[]>([])
  const [confirmAction, dismissAction] = actions
  const [options, setOptions] = React.useState(defaultConfirmOptions)

  /** The promise that will take action from the invoker. */
  const confirm = React.useCallback(
    (options: ConfirmOptions = defaultConfirmOptions) => {
      return new Promise((resolve, reject) => {
        setOptions((prev) => ({ ...prev, ...options }))
        setActions([resolve, reject])
      })
    },
    []
  )

  /** Reset the state of the hook. */
  const handleClose = () => {
    setActions([])
  }
  /** Call Dismiss action. */
  const handleDismiss = React.useCallback(() => {
    dismissAction()
    handleClose()
  }, [dismissAction])
  /** Call confirm action. */
  const handleConfirm = React.useCallback(() => {
    confirmAction()
    handleClose()
  }, [confirmAction])

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmDialog
        options={options}
        open={actions.length !== 0}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
      />
    </>
  )
}
export default ConfirmProvider
