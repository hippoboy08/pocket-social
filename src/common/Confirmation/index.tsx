import React from "react"
import { DialogProps } from "@material-ui/core/Dialog"
import { ButtonProps } from "@material-ui/core/Button"

export const ConfirmContext = React.createContext(
  (options?: ConfirmOptions) => new Promise((resolve, reject) => {})
)
export const useConfirm = () => {
  return React.useContext(ConfirmContext)
}

export interface ConfirmOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  confirmText?: React.ReactNode
  dismissText?: React.ReactNode
  dialogProps?: DialogProps
  confirmButtonProps?: ButtonProps
  dismissButtonProps?: ButtonProps
}
export { default as ConfirmProvider } from "./ConfirmProvider"
