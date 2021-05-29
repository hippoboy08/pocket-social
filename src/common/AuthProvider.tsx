import firebase from 'firebase'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useFirebase } from './FirebaseProvider'

const storageKey = 'firebaseUser'

/**Read user data from storage. */
const readUserData = (): firebase.User => {
  try {
    const jsonUser = localStorage.getItem(storageKey)
    let user = null
    if (jsonUser) {
      user = JSON.parse(jsonUser)
      ;(async () => {
        await firebase.auth().currentUser?.getIdToken(true)
      })()
    }
    return user as firebase.User
  } catch (e) {
    console.error('Cannot read user data!')
    throw Error(e)
  }
}
interface AuthContextProps {
  user: firebase.User | null
  signIn: (email: string, password: string) => Promise<firebase.User | null>
  signOut: () => Promise<void>
}
const AuthContext = React.createContext<AuthContextProps>(
  {} as AuthContextProps
)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const firebaseApp = useFirebase()
  const [user, setUser] = React.useState<firebase.User | null>(readUserData())
  const history = useHistory()
  const location = useLocation()
  const { from } = (location.state as { from: { pathname: string } }) || {
    from: { pathname: '/manage' },
  }

  /** Authenticate user. */
  const signIn = async (email: string, password: string) => {
    try {
      const user = (
        await firebaseApp.auth().signInWithEmailAndPassword(email, password)
      ).user
      // Securely save data to local storage.
      localStorage.setItem(storageKey, JSON.stringify(user))
      // Update app-scoped user data.
      setUser(user)
      history.replace(from)
      return user
    } catch (err) {
      // console.log(err.message)
      throw Error(err)
    }
  }

  /** Log out. */
  const signOut = async () => {
    if (!user || user.uid !== firebaseApp.auth().currentUser?.uid)
      throw Error('User is already logged out!')

    try {
      await firebaseApp.auth().signOut()
      localStorage.removeItem(storageKey)
      setUser(null)
      history.replace('/login')
    } catch (error) {
      console.error(error)
      throw Error(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const authContext = React.useContext(AuthContext)
  if (authContext == null) {
    throw new Error('useAuth() called outside of a AuthProvider?')
  }
  return authContext
}

export default AuthProvider
