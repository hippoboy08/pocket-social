import { makeStyles, Theme, Stepper, Step, StepLabel, StepContent, Button, Paper, Typography } from "@material-ui/core"
import React from "react"
import RecordDetails from "../pages/RecordEdit"

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
  { name: 'Stepper' }
)
interface StepperProps {
  steps: {name: string, content: React.ReactNode}[]
}
const VerticalStepper = ({steps}: StepperProps) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={step.name}>
            <StepLabel onClick={() => setActiveStep(index)} style={{cursor: 'pointer'}}>
              {step.name}
            </StepLabel>
            <StepContent TransitionProps={{ unmountOnExit: false }}>
              {step.content}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant='outlined'
                    // color='primary'
                    onClick={handleNext}
                    className={classes.button}
                    hidden={activeStep === steps.length - 1}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished!</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  )
}
export default VerticalStepper