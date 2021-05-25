import React from 'react'
import Pocket from '../AppTypes'

const Home = () => {
  // const test:Pocket.Record = {} as Pocket.Record
  const test = Pocket.RecordType.facebook
  console.log(test)
  return (
    <div>
      This is Home page
    </div>
  )
}

export default Home
