import React, { useState, useEffect, useMemo } from "react"
// Other libraries related imports
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom";

// Shared
import { Spacing } from "shared/styles/styles"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { useDebounce } from "shared/hooks/use-debounce"
import { roleState, RollStateType, StateList, ToolbarAction } from "shared/models/roll"

// Components
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import {
  ActiveRollOverlay,
  ActiveRollAction,
} from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Toolbar } from "staff-app/components/toolbar/toolbar.component";



export const HomeBoardPage: React.FC = () => {
  // All states
  const [isRollMode, setIsRollMode] = useState(false)
  const [currentFilterAttendanceState, setCurrentFilterAttendanceState] = useState<string | null>(null)
  const [attendance, setattendance] = useState<Record<string, RollStateType>>({})
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("ASC")
  
  // Api calls
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({
    url: "get-homeboard-students",
  })
  const [saveRole, saveRoleData, saveRoleLoadState ] = useApi<{ success: boolean }>({
    url: "save-roll",
  })

  // Other hooks
  const navigate = useNavigate();
  const searchText = useDebounce<string>(search, 400)

  // All useEffects
  useEffect(() => {
    if(saveRoleLoadState === "loaded" && saveRoleData?.success) {
      navigate('/staff/activity')
    }
  }, [saveRoleLoadState, saveRoleData])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  // all useMemos
  const filteredStudents = useMemo(() => {
    // If students length found
    if (data?.students?.length) {
      let students: Person[] = data?.students
      // Apply filter on attendance state
      if(currentFilterAttendanceState && currentFilterAttendanceState !== "" && currentFilterAttendanceState !== "all") {
        students = data.students.filter((student) => attendance[student.id] === currentFilterAttendanceState)
      } 
      // Apply search
      if (searchText && searchText !== "") {
        students = students.filter((student) =>
          (student.first_name + " " + student.last_name)
            .toLocaleLowerCase()
            .trim()
            .includes(searchText.toLocaleLowerCase())
        )
      }
      // Apply sorting
      if(sort) {
        students.sort((a: Person, b: Person) => {
          const isAscending = sort === "ASC"
          const studenta = (a.first_name + " " + a.last_name).toLocaleLowerCase()
          const studentb = (b.first_name + " " + b.last_name).toLocaleLowerCase()

          if (studenta < studentb) {
            return isAscending ? -1 : 1;
          }
          if (studenta > studentb) {
            return isAscending ? 1 : -1;
          }
          return 0;
        });
      }
      return students
    }
    return []
  }, [data, searchText, sort, attendance, currentFilterAttendanceState])

  const attendenceCounts: StateList[] = useMemo(() => {
    const allStudentCount = data?.students?.length || 0
    const allStudentsAttedenceId: string[] = Object.keys(attendance)
    const otherCounts = allStudentsAttedenceId.reduce((counter: Record<string, number>, studentId: string) => {
      if(attendance[studentId] === roleState.PRESENT) {
        counter[roleState.PRESENT]+=1
      } else if(attendance[studentId] === roleState.LATE) {
        counter[roleState.LATE]+=1
      } else if(attendance[studentId] === roleState.ABSENT) {
        counter[roleState.ABSENT]+=1
      }
      return counter
    }, {
      [roleState.PRESENT]: 0,
      [roleState.LATE]: 0,
      [roleState.ABSENT]: 0
    })
    const counts: StateList[] = [
      { type: "all", count: allStudentCount },
      { type: roleState.PRESENT, count: otherCounts[roleState.PRESENT] },
      { type: roleState.LATE, count: otherCounts[roleState.LATE] },
      { type: roleState.ABSENT, count: otherCounts[roleState.ABSENT] },
    ]
    return counts
  }, [attendance])

  // All handlers
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if(action === "sort") {
      setSort(sort === "ASC" ? "DESC" : "ASC")
    }
  }

  const completeCurrentRole = () => {
    const roleInput = {
      student_roll_states: Object.keys(attendance).map(studentId => ({ student_id: Number(studentId), roll_state: attendance[studentId] }))
    }
    saveRole(roleInput)
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    } else if(action === "complete") {
      completeCurrentRole()
    }
  }

  const attendenceChangeHandler = (studentId: number, status: string) => {
    setattendance({
      ...attendance,
      [studentId]: status
    })
  }

  const onFilterAttendanceStateHandler = (stateType: string) => {
    setCurrentFilterAttendanceState(stateType)
  }

  return (
    <>
      <Styled.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          searchValue={search}
          setSearch={setSearch}
          sortDetails={sort}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && (
          <>
            {!!filteredStudents.length &&
              filteredStudents.map((s) => (
                <StudentListTile
                  key={s.id}
                  isRollMode={isRollMode}
                  student={s}
                  attendenceChangeHandler={attendenceChangeHandler}
                  initialAttendanceState={attendance[s.id]}
                />
              ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </Styled.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        attendenceCounts={attendenceCounts}
        onFilterAttendanceStateHandler={onFilterAttendanceStateHandler}
      />
    </>
  )
}

const Styled = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `
}
