import React from 'react'
import './App.css'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Main from './components/main'

const App: React.FC = () => {
  return (
    <div className={'container'}>
      <Header />
      <Sidebar />
      <Main />
    </div>
  )
}

export default App
