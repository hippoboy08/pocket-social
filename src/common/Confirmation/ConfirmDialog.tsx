import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import React from 'react'
import { ConfirmOptions } from '.'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme) => ({
    buttonWrapper: {
      padding: 0,
    },
    cancelButton: {
      width: '50%',
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.getContrastText(theme.palette.primary.light),
      borderTop: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: '0px',
      borderRight: `1px solid ${theme.palette.primary.light}`,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        borderTop: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        color: '#fff',
      },
    },
    confirmButton: {
      width: '50%',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      borderTop: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: '0px',
      marginLeft: '0px!important',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        borderTop: `1px solid ${theme.palette.primary.main}`,
      },
    },
  }),
  { name: 'dialog' }
)

interface ConfirmDialogProps {
  open: boolean
  options: ConfirmOptions
  onDismiss: Function
  onConfirm: Function
  onClose: Function
}
const ConfirmDialog = ({
  open = false,
  options,
  onDismiss,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const {
    title,
    description,
    confirmText,
    dismissText,
    dialogProps,
    confirmButtonProps,
    dismissButtonProps,
  } = options

  const classes = useStyles()
  return (
    <Dialog
      {...dialogProps}
      open={open}
      onClose={() => onClose()}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.buttonWrapper}>
        <Button
          className={classes.cancelButton}
          {...dismissButtonProps}
          onClick={() => onDismiss()}
          color='primary'
        >
          {dismissText}
        </Button>
        <Button
          className={classes.confirmButton}
          {...confirmButtonProps}
          onClick={() => onConfirm()}
          color='primary'
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ConfirmDialog
