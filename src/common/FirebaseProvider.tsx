import firebase from 'firebase'
import React from 'react'

const FirebaseContext = React.createContext<firebase.app.App>(
  {} as firebase.app.App
)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

interface Props {
  children: React.ReactNode
}
const FirebaseProvider = ({ children }: Props) => {
  const [app] = React.useState(firebaseApp)
  // console.log(app)
  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const firebaseContext = React.useContext(FirebaseContext)
  if (firebaseContext == null) {
    throw new Error('useFirebase() called outside of a FirebaseProvider?')
  }
  return firebaseContext
}
export default FirebaseProvider
