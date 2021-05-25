import { Icon, useTheme } from '@material-ui/core'
import React from 'react'
import { SocialIcon, SocialIconProps } from 'react-social-icons'

interface CustomSocialIconProps extends SocialIconProps {
  // darkmode: boolean
  size?: 'small' | 'large'
}
const CustomSocialIcon = ({ size = 'small', ...rest }: CustomSocialIconProps) => {
  const theme = useTheme()
  const dimensions = {
    'small': {height: 25, width: 25},
    'large': {height: 40, width: 40},
  }
  return rest.network === 'phone_iphone' ? (
    <Icon fontSize={size}>{rest.network}</Icon>
  ) : (
    <SocialIcon
      fgColor={theme.palette.type === 'dark' ? 'white' : undefined}
      style={{...dimensions[size]}}
      {...rest}
    />
  )
}

export default CustomSocialIcon
