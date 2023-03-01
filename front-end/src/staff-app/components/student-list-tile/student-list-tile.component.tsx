import React from "react"

// Other library related imports
import styled from "styled-components"

// Shared
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Person, PersonHelper } from "shared/models/person"
import { RollStateType } from "shared/models/roll"

// Components
import { RollStateSwitcher } from "staff-app/components/roll-state/roll-state-switcher.component"

// Assets
import { Images } from "assets/images"

interface Props {
  initialAttendanceState: RollStateType
  isRollMode?: boolean
  student: Person
  attendenceChangeHandler: (studentId: number, state: string) => void
}
export const StudentListTile: React.FC<Props> = ({ initialAttendanceState, isRollMode, student, attendenceChangeHandler }) => {
  return (
    <Styled.Container>
      <Styled.Avatar url={Images.avatar}></Styled.Avatar>
      <Styled.Content>
        <div>{PersonHelper.getFullName(student)}</div>
      </Styled.Content>
      {isRollMode && (
        <Styled.Roll>
          <RollStateSwitcher initialState={initialAttendanceState} onStateChange={(state) => attendenceChangeHandler(student.id, state)}/>
        </Styled.Roll>
      )}
    </Styled.Container>
  )
}

const Styled = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
    display: flex;
    align-items: center;
  `,
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
  `,
}
