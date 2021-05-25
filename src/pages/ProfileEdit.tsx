import DateFnsUtils from '@date-io/date-fns'
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Icon,
  TextField,
} from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Pocket from '../AppTypes'
import { useAuth } from '../common/AuthProvider'
import { Action, useStore } from '../common/StoreProvider'
import useFirestore from '../hooks/useFirestore'
import { useHistory } from 'react-router-dom'

type UserProfile = Partial<Pocket.UserProfile> & {
  photo: File | null
}
const defaultValues: UserProfile = {
  firstName: 'test',
  lastName: '',
  bio: '',
  dob: new Date(),
  nationality: '',
  profession: '',
  photoUrl: '',
  photo: null,
}

const ProfileEdit = () => {
  const [state, dispatch] = useStore()
  const { user } = useAuth()
  const { updateUserProfile } = useFirestore()
  const history = useHistory()
  const [editing, setEditing] = useState(false)
  const ref = React.useRef<UserProfile>()

  const { register, handleSubmit, control, setValue, getValues, watch } =
    useForm<UserProfile>({
      defaultValues,
    })

  /** Sync user profile to form data. */
  const syncProfile = (profile: UserProfile | Pocket.UserProfile) => {
    Object.entries(profile).map(([key, value]) => {
      setValue(key as keyof UserProfile, value)
      return
    })
  }

  /** Handle form state when edit mode changes. */
  const handleEditMode = (state: boolean, isSubmited: boolean = false) => {
    // Save the lastest form state.
    if (state) {
      ref.current = getValues()
    } else {
      if (ref.current && !isSubmited) {
        // Restore the form state to last saved one.
        syncProfile(ref.current)
      }
    }
    setEditing(state)
  }

  /** Handle file change. */
  const handleFileChange = (file: File) => {
    if (file) {
      setValue('photo', file)
      const url = URL.createObjectURL(file)
      console.log(url)
      setValue('photoUrl', url)
    }
  }

  /** Navigate back. */
  const navigateBack = () => {
    history.goBack()
  }

  /** Handle submited data. */
  const onSave = async (data: UserProfile) => {
    // console.log(data)
    if (user && data) {
      // console.log(data.photo)

      const updatedProfile = await updateUserProfile(user?.uid, data).catch(
        console.log
      )
      if (!updatedProfile) return
      // console.log(updatedProfile)
      handleEditMode(false, true)
      dispatch({ type: Action.UPDATE_PROFILE, payload: updatedProfile })
      navigateBack()
    }
    // const result = await updateRecord(user.uid, data)
  }

  React.useEffect(() => {
    // get userProfile by id
    const profile = state.userProfile
    // console.log(profile)
    // syncing data
    if (profile) {
      syncProfile(profile)
    }
  }, [state.userProfile])

  React.useEffect(() => {
    // console.log('form :', getValues())
  }, [watch('photo')])

  return (
    <>
      <form onSubmit={handleSubmit(onSave)}>
        <fieldset disabled={!editing} style={{border: 'none'}}>
          <Card style={{ boxShadow: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {!editing || !!watch('photo') ? (
                <CardActionArea
                  style={{ display: 'flex' }}
                  onClick={() => {
                    setValue('photo', null)
                    handleEditMode(true)
                  }}
                >
                  <CardMedia title='Click to chosse a photo'>
                    <Avatar
                      style={{ width: 200, height: 200 }}
                      src={watch('photoUrl')}
                    />
                  </CardMedia>
                </CardActionArea>
              ) : (
                // <Controller
                //   render={({ ...rest }) => (
                <DropzoneArea
                  filesLimit={1}
                  showPreviews={false}
                  showPreviewsInDropzone={false}
                  // clearOnUnmount={true}
                  onChange={(files) => handleFileChange(files[0])}
                  // {...rest}
                />
                //   )}
                //   name={'photo'}
                //   control={control}
                //   defaultValue=''
                // />
              )}

              <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <TextField
                  // error
                  label='First Name'
                  fullWidth
                  inputProps={{ ...register('firstName') }}
                />
                <TextField
                  // error
                  label='Last Name'
                  fullWidth
                  inputProps={{ ...register('lastName') }}
                />
              </div>
              <TextField
                // error
                label='Bio'
                placeholder='Tell a little about you...'
                multiline
                rows={3}
                rowsMax={15}
                inputProps={{ ...register('bio') }}
              />
              <TextField
                // error
                label='Nationality'
                inputProps={{ ...register('nationality') }}
              />
              <TextField
                // error
                label='Profession'
                placeholder='i.e Developer,..'
                inputProps={{ ...register('profession') }}
              />
              <Controller
                name='dob'
                control={control}
                render={({ ...rest }) => (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disabled={!editing}
                      margin='normal'
                      label='Date of Birth'
                      format='dd/MM/yyyy'
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      // autoOk
                      value={getValues('dob') as Date}
                      onChange={(date) => setValue('dob', date as Date)}
                    />
                  </MuiPickersUtilsProvider>
                )}
              />

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  fullWidth
                  type='button'
                  onClick={() => handleEditMode(!editing)}
                >
                  {editing ? 'Cancel' : <><Icon>edit</Icon>Edit</>}
                </Button>
                {editing && (
                  <Button fullWidth type='submit'>
                    <Icon>save</Icon>Save
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </fieldset>
      </form>
      <Button fullWidth onClick={() => navigateBack()}>
        <Icon>arrow_back</Icon>Back
      </Button>
    </>
  )
}

export default ProfileEdit
