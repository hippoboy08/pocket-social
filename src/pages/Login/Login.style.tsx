import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  loginBox: {
    position: 'relative',
    width: '70%',
    top: '-5%',
    minWidth: 280,
    maxWidth: 350,
    height: 'auto',
    background: 'rgba(0,0,0,0.4)',
    padding: '40px 0 40px 0',
    boxShadow: '0 0 10px 0 rgba(255,255,255,0.3)',
    borderRadius: 5,
  },
  loginText: {
    position: 'relative',
    top: 10,
    width: '100%',
    textAlign: 'center',
    // color: theme.palette.primary.light,
    fontSize: 22,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  textField: {
    width: '82%',
    left: '50%',
    transform: 'translateX(-50%)',
    // color: theme.palette.primary.light,
    '& .MuiOutlinedInput-input:-webkit-autofill': {
      WebkitTextFillColor: '#FFFFFF',
    },
  },
  inputLabel: {
    // color: theme.palette.primary.light,
    fontSize: 14,
  },
  inputBorder: {
    transition: 'all ease-out 0.3s',
    '&:hover': {
      '& > $fieldset': {
        borderColor: `${theme.palette.primary.main}!important`,
      },
    },
    '& > $input': {
      color: theme.palette.primary.light,
    },
    '& > $fieldset': {
      borderColor: theme.palette.primary.light,
    },
  },
  button: {
    position: 'relative',
    width: '82%',
    left: '50%',
    boxSizing: 'border-box',
    padding: '10px',
    textAlign: 'center',
    // color: theme.palette.primary.dark,
    // background: theme.palette.primary.light,
    transform: 'translateX(-50%)',
    marginTop: 15,
    borderRadius: 4,
    transition: 'all ease-out 0.3s',
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.primary.main,
      // color: theme.palette.primary.light,
    },
  },
  subText: {
    fontSize: 12,
    color: theme.palette.primary.light,
    textAlign: 'center',
    marginTop: 30,
  },
}))
