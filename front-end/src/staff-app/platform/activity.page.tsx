import React, { useEffect, useMemo } from "react"

// Other libraries related imports
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Shared
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { Person } from "shared/models/person"
import { timeLineDateFormatter } from "shared/helpers/date-format"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

// Components
import { Timeline } from "staff-app/components/activity/timeline.component"

export const ActivityPage: React.FC = () => {
  // APi calls
  const [getStudents, studentData, studentLoadState] = useApi<{
    students: Person[]
  }>({
    url: "get-homeboard-students",
  })
  const [getActivities, activityData, loadState] = useApi<{
    activity: Activity[]
  }>({
    url: "get-activities",
  })

  // All useEffects
  useEffect(() => {
    getStudents()
    getActivities()
  }, [getStudents, getActivities])

  // All useMemos
  const students: Record<number, string> | null = useMemo(() => {
    if (studentData?.students?.length) {
      return studentData.students.reduce(
        (obj: Record<number, string>, student: Person) => {
          obj[student.id] = `${student.first_name} ${student.last_name}`
          return obj
        },
        {}
      )
    }
    return null
  }, [studentData])

  const timelines = useMemo(() => {
    if (activityData?.activity?.length) {
      return activityData.activity.sort((activity1, activity2) =>
        activity1.date > activity2.date ? -1 : 1
      )
    }
    return []
  }, [activityData])

  return (
    <Styled.Container>
      <Styled.Header>Activities</Styled.Header>
      <Styled.TimelineContainer>
        {loadState === "loading" || studentLoadState === "loading" ? (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        ) : (
          <>
            {!!timelines?.length ? (
              timelines.map((timeline, index) => {
                return (
                  <Timeline
                    key={index}
                    date={timeLineDateFormatter(timeline.date)}
                    students={students}
                    roll={timeline.entity}
                  />
                )
              })
            ) : (
              <Styled.NotFoundText>No Activities Found</Styled.NotFoundText>
            )}
          </>
        )}
      </Styled.TimelineContainer>
    </Styled.Container>
  )
}

const Styled = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: ${Spacing.u4} auto 0;
    background-color: ${Colors.neutral.white};
    border-radius: ${BorderRadius.default};
    box-shadow: 0 2px 7px rgb(5 66 145 / 13%);
    .activity-header {
      font-size: ${FontSize.u3};
      font-weight: ${FontWeight.strong};
      border-bottom: 1px solid ${Colors.grey.lighter};
      padding: 15px;
    }
  `,
  Header: styled.div`
    font-size: ${FontSize.u3};
    font-weight: ${FontWeight.strong};
    border-bottom: 1px solid ${Colors.grey.lighter};
    padding: 15px;
  `,
  TimelineContainer: styled.div`
    overflow: auto;
    max-height: calc(100vh - 150px);
  `,
  NotFoundText: styled.div`
    text-align: center;
    padding: 50px;
  `,
}
