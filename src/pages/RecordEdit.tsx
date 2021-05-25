import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@material-ui/core'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import Pocket from '../AppTypes'
import { useAuth } from '../common/AuthProvider'
import { Action, useStore } from '../common/StoreProvider'
import CustomSocialIcon from '../components/CustomSocialIcon'
import VerticalStepper from '../components/VerticalStepper'
import useFirestore from '../hooks/useFirestore'

type FormRecord = Omit<Pocket.Record, 'id' | 'userId'>
const defaultValues: FormRecord = {
  type: Pocket.RecordType.url,
  description: '',
  links: [new Pocket.Link({ value: '' })],
  isPublic: true,
}

const RecordDetails = () => {
  const params = useParams<{ id: string }>()
  const [state, dispatch] = useStore()
  const { user } = useAuth()
  const { updateRecord } = useFirestore()
  const history = useHistory()
  const theme = useTheme()

  const { register, handleSubmit, control, setValue, getValues } =
    useForm<FormRecord>({
      defaultValues,
    })
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'links',
  })

  /** Navigate back. */
  const navigateBack = () => {
    history.goBack()
  }

  React.useEffect(() => {
    // get record by id
    const record = state.records.find((r) => r.id === params.id)
    // sync record data to the form
    if (record) {
      Object.entries(record).map(([key, value]) => {
        if (key !== 'id') setValue(key as keyof FormRecord, value)
        return
      })
    }
  }, [params.id, state.records])

  /** Handle submited data. */
  const onSave = async (data: FormRecord) => {
    // console.log(data)
    if (user && data) {
      const updatedRecord = await updateRecord(params.id, data).catch((e) =>
        console.error(e)
      )
      if (!updatedRecord) return
      dispatch({
        type: Action.UPDATE_RECORD,
        payload: updatedRecord,
      })
      navigateBack()
    }
  }

  const TypeStep = React.memo(() => {
    return (
      <Box display='flex' flexDirection='column'>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <Select {...field}>
              {Object.entries(Pocket.RecordType).map(([key, value]) => {
                return (
                  <MenuItem key={key} value={value}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon>
                        {/* <Icon>{Pocket.RecordIcon(value)}</Icon> */}
                        <CustomSocialIcon network={Pocket.RecordIcon(value)} />
                      </ListItemIcon>
                      <ListItemText primary={value} />
                    </div>
                  </MenuItem>
                )
              })}
            </Select>
          )}
        />
        <TextField
          // error
          label='Description'
          inputProps={{ ...register('description') }}
        />
      </Box>
    )
  })

  const LinksStep = React.memo(() => {
    return (
      <Box display='flex' flexDirection='column'>
        {fields.map((link, index) => (
          <TextField
            key={link.id}
            {...register(`links.${index}.value` as const)}
            defaultValue={link.value}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon>insert_link</Icon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => remove(index)}>
                    <Icon>close</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}
        <Button onClick={() => append({ value: '', type: getValues('type') })}>
          <Icon>add</Icon>
        </Button>
      </Box>
    )
  })

  const steps = [
    { name: 'Choose Record Type', content: <TypeStep /> },
    { name: 'Add your Links', content: <LinksStep /> },
  ]

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Box display='flex' flexDirection='column'>
        <VerticalStepper steps={steps} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button fullWidth type='button' onClick={() => navigateBack()}>
            Cancel
          </Button>
          <Button fullWidth type='submit'>
            <Icon>save</Icon>Save
          </Button>
        </div>
      </Box>
    </form>
  )
}

export default RecordDetails
