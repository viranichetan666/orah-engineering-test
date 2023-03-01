import React from "react"

// Other library related imports
import styled from "styled-components"
import Button from "@material-ui/core/Button"

// Shared
import { BorderRadius, Spacing } from "shared/styles/styles"
import { StateList } from "shared/models/roll"

// Components
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"

export type ActiveRollAction = "filter" | "exit" | "complete"
interface Props {
  attendenceCounts: StateList[],
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  onFilterAttendanceStateHandler: (stateType: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { attendenceCounts, isActive, onItemClick, onFilterAttendanceStateHandler } = props
  return (
    <Styled.Overlay isActive={isActive}>
      <Styled.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={attendenceCounts}
            onItemClick={onFilterAttendanceStateHandler}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("complete")}>
              Complete
            </Button>
          </div>
        </div>
      </Styled.Content>
    </Styled.Overlay>
  )
}

const Styled = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
