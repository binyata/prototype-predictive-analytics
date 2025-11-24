import React from 'react'
import { Link } from 'react-router'

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <div className="sidebar-item">Dashboard</div>
      </Link>
    </div>
  )
}

export default Sidebar
