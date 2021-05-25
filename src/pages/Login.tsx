import React from 'react'
import { useAuth } from '../common/AuthProvider'

const Login = () => {
  const { user, signIn } = useAuth()
  const handlLogin = async () => {
    await signIn().catch((e) => console.log(e))
  }

  return (
    <div>
      This is login page
      <button onClick={() => handlLogin()}>Login</button>
    </div>
  )
}

export default Login
