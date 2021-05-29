import {
  Paper,
  Tabs,
  Tab,
  makeStyles,
  Icon,
  Box,
  Button,
} from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Pocket from '../AppTypes'
import { useAuth } from '../common/AuthProvider'
import { Action, useStore } from '../common/StoreProvider'
import Profile from '../components/Profile'
import Progress from '../components/Progress'
import Records from '../components/Records'
import useFirestore from '../hooks/useFirestore'
import { isEmpty } from '../utilities'
import QRCode from 'qrcode.react'

const useStyles = makeStyles(
  {
    root: {
      flexGrow: 1,
      maxWidth: 500,
    },
  },
  { name: 'Profile' }
)

interface TabPanelProps {
  children?: React.ReactNode
  activeValue: string
  value: string
}
const TabPanel = React.memo(
  ({ children, value, activeValue, ...other }: TabPanelProps) => {
    return (
      <div
        role='tabpanel'
        hidden={value !== activeValue}
        id={`scrollable-prevent-tabpanel-${value}`}
        aria-labelledby={`scrollable-prevent-tab-${value}`}
        {...other}
      >
        {value === activeValue && <Box p={3}>{children}</Box>}
      </div>
    )
  }
)

const Manage = () => {
  const { user, signOut } = useAuth()
  const [state, dispatch] = useStore()
  const { getUserProfile } = useFirestore()
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  // console.log(window.location.href, process.env.REACT_APP_HOST_DOMAIN, process.env.PUBLIC_URL)

  React.useEffect(() => {
    ;(async () => {
      if (user && isEmpty(state.userProfile)) {
        const userData = await getUserProfile(user.uid, false).catch((e) => {
          console.error(e)
        })

        if (!userData) return
        dispatch({ type: Action.FETCH_PUBLIC_PROFILE, payload: userData })
        // dispatch({type: Action.FETCH_RECORDS, payload: userData.records})
      }
      setLoading(false)
    })()
  }, [])
  const classes = useStyles()
  const [activeTab, setActiveTab] = React.useState('profile')

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Paper square>
      <Button fullWidth onClick={() => signOut()}>
          <Icon>power_settings_new</Icon>
        </Button>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant='fullWidth'
        TabIndicatorProps={{ style: { backgroundColor: 'black' } }}
      >
        <Tab value='profile' icon={<Icon>person</Icon>} label='My Profile' />
        <Tab value='records' icon={<Icon>view_list</Icon>} label='My Records' />
      </Tabs>
      <Progress visible={loading} />

      <TabPanel value='profile' activeValue={activeTab}>
        <QRCode
          size={80}
          value={`${process.env.REACT_APP_HOST_DOMAIN}/users/${user?.uid}`}
        />
        <Profile {...state.userProfile} />
        <Button
          size='small'
          fullWidth
          onClick={() => history.push('user/edit')}
        >
          <Icon fontSize='large'>edit</Icon>
        </Button>
      </TabPanel>
      <TabPanel value='records' activeValue={activeTab}>
        <Records records={state.records} editable={true} />
        <Button fullWidth onClick={() => history.push('records/new')}>
          <Icon>add</Icon>
        </Button>
      </TabPanel>
    </Paper>
  )
}

export default Manage
