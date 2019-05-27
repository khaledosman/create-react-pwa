import React, { useState, useEffect, useCallback } from 'react'
import Snackbar from '@material-ui/core/Snackbar'

let openSnackbarFn
let closeSnackbarFn
const snackbarContentProps = {
  'aria-describedby': 'snackbar-message-id'
}

const anchorOrigin = { vertical: 'top', horizontal: 'right' }

export const Notifier = React.memo(function Notifier (props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [action, setAction] = useState(null)

  const _closeSnackbar = () => {
    setOpen(false)
  }

  const _openSnackbar = ({ message, action }) => {
    setOpen(true)
    setMessage(message)
    setAction(action)
  }

  useEffect(() => {
    openSnackbarFn = _openSnackbar
    closeSnackbarFn = _closeSnackbar
  }, [])

  const handleSnackbarClose = () => {
    setOpen(false)
    setMessage('')
  }

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      message={<span
        id='snackbar-message-id'
        dangerouslySetInnerHTML={{ __html: message }}
      />}
      action={action}
      autoHideDuration={20000}
      onClose={useCallback(handleSnackbarClose)}
      open={open}
      SnackbarContentProps={snackbarContentProps}
    />
  )
})

export function openSnackbar ({ message, action }) {
  openSnackbarFn({ message, action })
}

export function closeSnackbar () {
  closeSnackbarFn()
}
