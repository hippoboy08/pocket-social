import {
  Paper,
  Tabs,
  Tab,
  makeStyles,
  Icon,
  Box,
} from '@material-ui/core'
import React, { useState } from 'react'
import Pocket from '../AppTypes'
import { useAuth } from '../common/AuthProvider'
import { Action, useStore } from '../common/StoreProvider'
import Profile from '../components/Profile'
import Progress from '../components/Progress'
import Records from '../components/Records'
import useFirestore from '../hooks/useFirestore'
import { isEmpty } from '../utilities'
import RecordDetails from './RecordEdit'

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
  const { user } = useAuth()
  const [state, dispatch] = useStore()
  const { getUserProfile } = useFirestore()
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    ;(async () => {
      if (user && isEmpty(state.userProfile)) {
        const userData = await getUserProfile(user.uid, false).catch((e) => {
          console.error(e)
        })
        
        if(!userData) return
        dispatch({type: Action.FETCH_PUBLIC_PROFILE, payload: userData})
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
    <>
      <Paper square>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant='fullWidth'
          TabIndicatorProps={{style:{backgroundColor: 'black'}}}
          // textColor='secondary'
          // aria-label='icon label tabs example'
        >
          <Tab value='profile' icon={<Icon>person</Icon>} label='My Profile' />
          <Tab
            value='records'
            icon={<Icon>view_list</Icon>}
            label='My Records'
          />
        </Tabs>
        <Progress visible={loading} />

        <TabPanel value='profile' activeValue={activeTab}>
          <Profile editable={true} {...state.userProfile} />
        </TabPanel>
        <TabPanel value='records' activeValue={activeTab}>
          <Records
            records={state.records}
            editable={true}
          />
        </TabPanel>
      </Paper>
    </>
  )
}

export default Manage
