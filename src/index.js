import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { openSnackbar, closeSnackbar } from './notifier/Notifier'
import Button from '@material-ui/core/Button'

serviceWorker.register({
  onUpdate: registration => {
    const onButtonClick = registration => e => {
      if (registration.waiting) {
        // When the user asks to refresh the UI, we'll need to reload the window
        let isRefreshing
        navigator.serviceWorker.addEventListener('controllerchange', function (event) {
          // Ensure refresh is only called once.
          // This works around a bug in "force update on reload".
          if (isRefreshing) {
            return
          }

          isRefreshing = true
          console.log('Controller loaded')
          window.location.reload()
        })

        // Send a message to the new serviceWorker to activate itself
        registration.waiting.postMessage('skipWaiting')
      }
    }
    openSnackbar({
      message: 'A new version of this app is available.',
      action: <Button color='secondary' size='small' onClick={onButtonClick(registration)}> Load new version </Button>
    })
  },
  onSuccess: registration => {
    openSnackbar({ message: 'This application works offline! Content has been cached for offline usage.' })
  },
  onOffline: () => {
    openSnackbar({ message: 'No internet connection available.. The application is running in offline mode!' })
  },
  onOnline: () => {
    closeSnackbar()
  }
})
ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
