import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import Dashboard from '../dashboard'
import Loading from '../loading'

const Main: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Suspense>
  )
}

export default Main
