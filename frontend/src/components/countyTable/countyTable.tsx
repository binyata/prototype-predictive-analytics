import React, { useState, useMemo, useCallback } from 'react'
import { CountyData } from '../../types/county'
import { API_URL } from '../../config/env'
import './countyTable.css'

type CountyTableProps = {
  countySprainedAnkleData: CountyData[]
}

const CountyTable: React.FC<CountyTableProps> = ({ countySprainedAnkleData }) => {
  const [dirtyValues, setDirtyValues] = useState<Record<number, string>>({})

  const countyValueMap = useMemo(() => {
    const initial: Record<number, number> = {}
    countySprainedAnkleData.forEach((c) => {
      initial[c.id] = c.value ?? 0
    })
    return initial
  }, [countySprainedAnkleData])

  const effectiveDirtyValues = useMemo(() => {
    const entries = Object.entries(dirtyValues).filter(([idStr, valueStr]) => {
      const id = Number(idStr)
      const original = countyValueMap[id] ?? 0
      const isSameAsOriginal =
        (valueStr === '' && original === 0) || (valueStr !== '' && Number(valueStr) === original)
      return !isSameAsOriginal
    })
    return Object.fromEntries(entries)
  }, [dirtyValues, countyValueMap])

  const displayValues = useMemo(() => {
    const initialDisplay: Record<number, string> = {}
    Object.entries(countyValueMap).forEach(([idStr, value]) => {
      const id = Number(idStr)
      initialDisplay[id] = String(value ?? '')
    })
    return { ...initialDisplay, ...effectiveDirtyValues }
  }, [countyValueMap, effectiveDirtyValues])

  const handleValueChange = useCallback((id: number, newValueStr: string) => {
    setDirtyValues((prev) => ({
      ...prev,
      [id]: newValueStr,
    }))
  }, [])

  const handleUpdateCountyData = async () => {
    const payload = Object.entries(effectiveDirtyValues).map(([idStr, valueStr]) => ({
      id: Number(idStr),
      value: valueStr === '' ? 0 : Number(valueStr),
    }))

    try {
      await fetch(`${API_URL}/counties`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setDirtyValues({})
    } catch (err) {
      console.error(`Failed to bulk update county values ${err}`)
    }
  }

  const hasChanges = Object.keys(effectiveDirtyValues).length > 0

  return (
    <div className="county-table-wrapper">
      <div className="county-table-scroll">
        <table className="county-table">
          <thead>
            <tr>
              <th>County</th>
              <th>Known Sprained Ankle Cases</th>
              <th>
                <button onClick={handleUpdateCountyData} disabled={!hasChanges}>
                  Update
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {countySprainedAnkleData.map((county) => {
              const rawValue = displayValues[county.id] ?? ''
              const inputValue = rawValue === '0' ? '' : rawValue

              return (
                <tr key={county.id}>
                  <td>{county.name}</td>
                  <td>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => handleValueChange(county.id, e.target.value)}
                      placeholder={inputValue === '' ? '0' : ''}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CountyTable
