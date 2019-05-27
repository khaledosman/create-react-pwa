import React, { PureComponent } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
let openSnackbarFn
let closeSnackbarFn
export class Notifier extends PureComponent {
  state = {
    open: false,
    message: '',
    action: null
  };

  componentDidMount () {
    openSnackbarFn = this.openSnackbar
    closeSnackbarFn = this.closeSnackbar
  }

  closeSnackbar = () => {
    this.setState({ open: false })
  }

  openSnackbar = ({ message, action }) => {
    this.setState({
      open: true,
      message,
      action
    })
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: ''
    })
  };

  render () {
    const message = (
      <span
        id='snackbar-message-id'
        dangerouslySetInnerHTML={{ __html: this.state.message }}
      />
    )

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={message}
        action={this.state.action}
        autoHideDuration={20000}
        onClose={this.handleSnackbarClose}
        open={this.state.open}
        SnackbarContentProps={{
          'aria-describedby': 'snackbar-message-id'
        }}
      />
    )
  }
}

export function openSnackbar ({ message, action }) {
  openSnackbarFn({ message, action })
}

export function closeSnackbar () {
  closeSnackbarFn()
}