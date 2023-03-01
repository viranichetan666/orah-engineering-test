import React from "react"

// Other libraries related imports
import styled from "styled-components"
import { Chip } from "@material-ui/core"
import Tooltip from '@material-ui/core/Tooltip';

// Shared
import { Colors } from "shared/styles/colors"
import { Roll } from "shared/models/roll"

interface Props {
  date: string
  roll: Roll,
  students: Record<number, string> | null
}

export const Timeline: React.FC<Props> = ({ date, roll, students }) => {
  const {student_roll_states} = roll
  return (
    <Styled.Timeline>
      <div className="activity-date">{date}</div>
      <div className="attendance">
        {
          !!student_roll_states?.length &&
          student_roll_states.map((student, index) => {
            const studentName = (students && student.student_id in students) ?  students[student.student_id] : student.student_id
            return (
              <Tooltip title={student.roll_state?.toUpperCase()}>
                <Chip key={index} label={studentName} className={`student-detail ${student.roll_state}`} />
              </Tooltip>
            )
          })
        }
      </div>
    </Styled.Timeline>
  )
}

const Styled = {
  Timeline: styled.div`
    display: flex;
    padding: 15px;
    border-bottom: 1px solid ${Colors.grey.lighter};
    .activity-date {
      min-width: 190px;
      font-weight: 500;
      border-right: 1px solid ${Colors.grey.lighter};
      padding-right: 10px;
      display: flex;
      align-items: center;
    }
    .attendance {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .present {
        background-color: ${Colors.success.darker};
        color: ${Colors.neutral.white};
      }
      .absent {
        background-color: ${Colors.grey.darker};
        color: ${Colors.neutral.white};
      }
      .late {
        background-color: ${Colors.warning.darker};
        color: ${Colors.neutral.white};
      }
      .student-detail {
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  `,
}
