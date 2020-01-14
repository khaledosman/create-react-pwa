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

  const _closeSnackbar = useCallback(() => {
    setOpen(false)
  },[])

  const _openSnackbar = useCallback(({ message, action }) => {
    setOpen(true)
    setMessage(message)
    setAction(action)
  }, [])

  useEffect(() => {
    openSnackbarFn = _openSnackbar
    closeSnackbarFn = _closeSnackbar
  }, [_openSnackbar, _closeSnackbar])

  const handleSnackbarClose = useCallback(() => {
    setOpen(false)
    setMessage('')
  }, [])

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      message={<span
        id='snackbar-message-id'
        dangerouslySetInnerHTML={{ __html: message }}
      />}
      action={action}
      autoHideDuration={20000}
      onClose={handleSnackbarClose}
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
