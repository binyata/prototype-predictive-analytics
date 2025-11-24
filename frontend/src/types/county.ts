import type { Geometry } from 'geojson'

export type CountyProps = {
  id?: string
  GEOID?: string
  name?: string
  [key: string]: string | number | undefined | null
}

export type CountyFeature = {
  type: 'Feature'
  geometry: Geometry
  properties: CountyProps
  id?: string | number
}

export type TooltipState = {
  x: number
  y: number
  name: string
  chanceOfSprainedAnkle: number
}

export type CountyData = {
  id: number
  name: string
  value: number
}
