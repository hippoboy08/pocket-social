import React from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { useAuth } from './common/AuthProvider'
import RecordDetails from './pages/RecordEdit'
import Home from './pages/Home'
import Manage from './pages/Manage'
import PublicRecords from './pages/PublicRecords'
import ProfileEdit from './pages/ProfileEdit'
import Login from './pages/Login'

const NoMatch = () => {
  return (
    <Redirect to={{ pathname: '/manage'}} />
  )
}
interface PrivateRouteProps extends RouteProps {
  isPrivate?: boolean
}
const ProtectedRoute = React.memo(
  ({ children, isPrivate = false, ...rest }: PrivateRouteProps) => {
    const { user } = useAuth()
    // console.log(user)

    return isPrivate ? (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          )
        }
      />
    ) : (
      <Route {...rest} children={children} />
    )
  }
)
const routes = [
  { path: '/', children: <Home />, exact: true, isPrivate: true },
  { path: '/login', children: <Login />, exact: true },
  { path: '/manage', children: <Manage />, exact: true, isPrivate: true },
  {
    path: '/records/:id',
    children: <RecordDetails />,
    exact: true,
    isPrivate: true,
  },
  { path: '/user/edit', children: <ProfileEdit />, exact: true, isPrivate: true },
  { path: '/users/:id', children: <PublicRecords />, exact: true },
  { path: '*', children: <NoMatch /> },
]

const AppRoutes = () => {
  return (
    <Switch>
      {routes.map((route, index) => (
        <ProtectedRoute key={index} {...route} />
      ))}
    </Switch>
  )
}

export default AppRoutes
