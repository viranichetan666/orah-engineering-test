export enum roleState {
  PRESENT = 'present',
  ABSENT= 'absent',
  LATE= 'late',
  UNMARK= 'unmark'
}

console.log("roleState.UNMARK", roleState.UNMARK)
export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RollStateType }[]
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RollStateType }[]
}

export type RollStateType = roleState.UNMARK | roleState.PRESENT | roleState.ABSENT | roleState.LATE

export type ItemType = RollStateType | "all"

export interface StateList {
  type: ItemType
  count: number
}

export type ToolbarAction = "roll" | "sort"
