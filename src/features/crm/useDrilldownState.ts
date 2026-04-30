import React from 'react'
import type { Deal } from './types'

export type DrilldownContext = 'kpi' | 'alert' | 'rep' | 'table'

export type DrilldownState = {
  title: string
  subtitle: string
  dealIds: string[]
  context: DrilldownContext
}

export function useDrilldownState() {
  const [drilldown, setDrilldown] = React.useState<DrilldownState | null>(null)

  function openDrilldown(nextDrilldown: DrilldownState) {
    setDrilldown(nextDrilldown)
  }

  function closeDrilldown() {
    setDrilldown(null)
  }

  function hasDeal(deal: Deal) {
    return Boolean(drilldown?.dealIds.includes(deal.id))
  }

  return {
    drilldown,
    openDrilldown,
    closeDrilldown,
    hasDeal,
  }
}