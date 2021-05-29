import React from 'react'
import { useStyles } from './Login.style'
import { Box, Button, Grid } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../../common/AuthProvider'
import Message from '../../common/Message'

interface FormInputs {
  email: string
  password: string
}
const defaultValues: FormInputs = {
  email: '',
  password: '',
}

const Login = () => {
  const classes = useStyles()
  const { signIn } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const { from } = (location.state as { from: { pathname: string } }) || {
    from: { pathname: '/manage' },
  }

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues,
  })
  const [message, setMessage] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = async (data: FormInputs) => {
    // authenticate user, set error on fail
    setIsLoading(true)
    const user = await signIn(data.email, data.password).catch((e) => {
      const mess = 'Your email or password is incorrect. Please try again!'
      setMessage(mess)
      setIsLoading(false)
    })
    
    if (!user) return

    // navigate to CMS dashboard on success
    history.replace(from)
  }

  /** Handle close event of the message stack */
  const handleCloseMessage = () => {
    // reset message text
    setMessage(null)
  }

  return (
    <Box className={classes.loginBox}>
      <Box className={classes.loginText}>Login</Box>
      <Box paddingTop={8} width={'100%'}>
        <form onSubmit={handleSubmit(handleLogin)}>
          <TextField
            className={classes.textField}
            id='username'
            label='Email'
            variant='outlined'
            size='small'
            inputProps={{ ...register('email') }}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputBorder,
            }}
          />
          <TextField
            className={classes.textField}
            id='password'
            type='password'
            inputProps={{ ...register('password') }}
            label='Password'
            variant='outlined'
            size='small'
            style={{ marginTop: 15 }}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputBorder,
            }}
          />
          <Button variant='outlined' type='submit' className={classes.button}>
            Login
          </Button>
        </form>
      </Box>
      <Message
        open={!!message}
        message={message || undefined}
        onClose={handleCloseMessage}
      />
    </Box>
  )
}

export default Login
