import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 5
  },
  colorPrimary: {
    backgroundColor: 'transparent'
  },
  bar1Determinate: {
    backgroundColor: theme.palette.common.black
  },
}), {name: 'Progress'})

interface ProgressProps {
  visible: boolean
}
const Progress = ({ visible = false }: ProgressProps) => {
  const classes = useStyles()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return !visible ? null : (
    <div style={{width: '100%'}}>
      <LinearProgress variant='determinate' value={progress} classes={{...classes}} />
    </div>
  )
}
export default Progress
