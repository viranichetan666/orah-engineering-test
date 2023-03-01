import React, { useState } from "react"

// Shared
import { roleState, RollStateType } from "shared/models/roll"

// Components
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RollStateType
  size?: number
  onStateChange?: (newState: RollStateType) => void
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = roleState.UNMARK, size = 40, onStateChange }) => {
  // Local states
  const [rollState, setRollState] = useState(initialState)

  // Handlers
  const nextState = () => {
    const states: RollStateType[] = [roleState.PRESENT, roleState.LATE, roleState.ABSENT]
    if (rollState === roleState.UNMARK || rollState === roleState.ABSENT) return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
