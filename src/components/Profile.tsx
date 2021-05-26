import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Icon,
} from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Pocket from '../AppTypes'
import { isEmpty } from '../utilities'

interface ProfileProps extends Pocket.UserProfile {
  // editable?: boolean
}
const Profile = React.memo(({ ...profile }: ProfileProps) => {
  return isEmpty(profile) ? null : (
    <Card style={{ boxShadow: 'none' }}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CardMedia>
          <Avatar
            style={{ width: 200, height: 200 }}
            src={profile.photoUrl}
          ></Avatar>
        </CardMedia>
      </div>
      <CardContent>
        {
          <Typography gutterBottom variant='h3' component='h2'>
            {`${profile.firstName} ${profile.lastName}`}
          </Typography>
        }
        <Typography variant='h5' component='h2'>
          {`${profile.nationality} ${profile.profession}`}
        </Typography>
        <Typography variant='h6' component='h2'>
          {`${profile.dob.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}`}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {profile.bio}
        </Typography>
      </CardContent>
    </Card>
  )
})

export default Profile
