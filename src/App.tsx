import { createMuiTheme, Paper, ThemeProvider, useMediaQuery } from '@material-ui/core'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './App.routes'
import AuthProvider from './common/AuthProvider'
import { ConfirmProvider } from './common/Confirmation'
import FirebaseProvider from './common/FirebaseProvider'
import StoreProvider from './common/StoreProvider'

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          common: {
            black: prefersDarkMode ? 'white' : 'black',
            white: prefersDarkMode ? 'black' : 'white',
          }
        },
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{height: 'fit-content', minHeight: '100vh', padding: 15, borderRadius: 0}}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 500, flex: 1 }}>
          <BrowserRouter>
            <FirebaseProvider>
              <AuthProvider>
                <StoreProvider>
                  <ConfirmProvider>
                    <AppRoutes />
                  </ConfirmProvider>
                </StoreProvider>
              </AuthProvider>
            </FirebaseProvider>
          </BrowserRouter>
        </div>
      </div>
      </Paper>
    </ThemeProvider>
  )
}

export default App
