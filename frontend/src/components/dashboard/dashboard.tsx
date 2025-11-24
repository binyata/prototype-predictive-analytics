import React from 'react'
import './dashboard.css'
import CountyTable from '../countyTable'
import CountyMap from '../countyMap'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { CountyData } from '../../types/county'
import { API_URL } from '../../config/env'

const Dashboard: React.FC = () => {
  const { data: countySprainedAnkleData } = useSuspenseQuery<CountyData[]>({
    queryKey: ['counties'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/counties`)
      if (!res.ok) throw new Error('Failed to fetch counties')
      return res.json()
    },
  })
  return (
    <div className={'dashboard-container'}>
      <div className={'dashboard-header'}>
        <h1 className={'dashboard-title'}>Sprained Ankle Cases Forecast</h1>
      </div>
      <div className={'dashboard-county-table-container'}>
        <CountyTable countySprainedAnkleData={countySprainedAnkleData} />
      </div>
      <div className={'dashboard-county-svg-container'}>
        <CountyMap countySprainedAnkleData={countySprainedAnkleData} />
      </div>
    </div>
  )
}

export default Dashboard
