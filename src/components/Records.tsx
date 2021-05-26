import React from 'react'
import {
  makeStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Icon,
  IconButton,
  Divider,
  Collapse,
  useTheme,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Pocket from '../AppTypes'
import { useConfirm } from '../common/Confirmation'
import CustomSocialIcon from './CustomSocialIcon'

const useStyles = makeStyles(
  (theme) => ({
    root: {
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
  { name: 'Records' }
)

type Record = Partial<Pocket.Record> & {
  // onClick: Function
  editable: boolean
}
const Record = React.memo(({ editable = false, ...record }: Record) => {
  // record = new Pocket.Record(record)
  const { id, type, description, links, isPublic } = record
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const history = useHistory()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <ListItem
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
          disableGutters
        >
          <ListItemAvatar>
            {/* <Icon color='inherit' fontSize='large'>{Pocket.RecordIcon(type)}</Icon> */}
            <CustomSocialIcon size='large' network={Pocket.RecordIcon(type)}></CustomSocialIcon>
          </ListItemAvatar>
          <ListItemText primary={type} secondary={description} />
        </ListItem>
        {editable && (
          <ListItemAvatar>
            <IconButton onClick={() => history.push(`records/${record.id}`)}>
              <Icon fontSize='small'>edit</Icon>
            </IconButton>
          </ListItemAvatar>
        )}
      </div>
      <Collapse in={open}>
        <List disablePadding>
          {links?.map((link, index) => (
            <ListItem
              key={index}
              style={{ paddingLeft: 50, color: theme.palette.common.black }}
              component='a'
              href={link.actionLink ?? undefined}
            >
              <Icon style={{marginRight: 5}}>insert_link</Icon><ListItemText primary={link.value} />
            </ListItem>
          ))}
        </List>
      </Collapse>
      <Divider />
    </div>
  )
})

interface RecordsProps {
  records: Pocket.Record[]
  editable?: boolean
}
const Records = ({ records = [], editable = false }: RecordsProps) => {
  const classes = useStyles()
  // console.log(records)
  const confirm = useConfirm()

  return (
    <>
      <List className={classes.root}>
        {records.map((record, ind) => (
          <Record
            key={ind}
            editable={editable}
            {...record}
          />
        ))}
      </List>
    </>
  )
}

export default Records
