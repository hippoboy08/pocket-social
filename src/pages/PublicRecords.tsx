import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Action, useStore } from '../common/StoreProvider'
import Profile from '../components/Profile'
import Records from '../components/Records'
import QRCode from 'qrcode.react'
import useFirestore from '../hooks/useFirestore'

const PublicRecords = () => {
  const match = useRouteMatch<{ id: string }>()
  const [state, dispatch] = useStore()
  const { getUserProfile } = useFirestore()

  React.useEffect(() => {
    const userId = match.params.id
    // console.log(match)
    const timeout = setTimeout(async () => {
      const userData = await getUserProfile(userId).catch(console.error)
      if (!userData) {
        console.error('User not found!')
        return
      }
      dispatch({ type: Action.FETCH_PUBLIC_PROFILE, payload: userData })
    }, 500)
    return () => clearTimeout(timeout)
  }, [match.params.id])
console.log(process.env.PUBLIC_URL)

  // React.useEffect(() => {
  //   // console.log(state)
  // }, [state])
  return (
    <>
      {/* Public records */}
      <QRCode value ={`${process.env.PUBLIC_URL}/users/${match.params.id}`} />
      <Profile {...state.userProfile} />
      <Records records={state.records} />
    </>
  )
}

export default PublicRecords
