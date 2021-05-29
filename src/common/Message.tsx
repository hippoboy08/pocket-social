import { Icon, IconButton, Snackbar } from '@material-ui/core'
import React from 'react'

interface MessageProps {
  message: string | undefined
  open: boolean
  onClose: Function
  /** The number of milliseconds to wait before automatically calling the onClose function. */
  autoHideDuration?: number
}
export const Message = ({
  message,
  open,
  onClose,
  autoHideDuration = 5000,
}: MessageProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      onClose={() => onClose()}
      message={message}
      autoHideDuration={autoHideDuration}
      action={
        <IconButton
          aria-label='close'
          color='inherit'
          onClick={() => onClose()}
        >
          <Icon>close</Icon>
        </IconButton>
      }
    ></Snackbar>
  )
}

export default Message
