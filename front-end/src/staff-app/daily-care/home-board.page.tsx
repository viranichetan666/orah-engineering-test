import React, { useState, useEffect, useCallback, useMemo } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import {
  ActiveRollOverlay,
  ActiveRollAction,
} from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { SearchBar } from "shared/components/searchbar/searchbar.component"
import { useDebounce } from "shared/hooks/use-debounce"
import { StateList } from "shared/models/roll"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [attendance, setattendance] = useState<Record<string, string>>({})
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({
    url: "get-homeboard-students",
  })
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("ASC")

  const searchText = useDebounce<string>(search, 400)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if(action === "sort") {
      setSort(sort === "ASC" ? "DESC" : "ASC")
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const onInputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    []
  )

  const filteredStudents = useMemo(() => {
    // If students length found
    if (data?.students?.length) {
      let students: Person[] = data?.students
      // Apply search
      if (searchText) {
        students = data.students.filter((student) =>
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
  }, [data, searchText, sort])

  const attendenceCounts: StateList[] = useMemo(() => {
    const allStudentCount = data?.students?.length || 0
    const allStudentsAttedenceId: string[] = Object.keys(attendance)
    const otherCounts = allStudentsAttedenceId.reduce((counter: Record<string, number>, studentId: string) => {
      if(attendance[studentId] === "present") {
        counter["present"]+=1
      } else if(attendance[studentId] === "late") {
        counter["late"]+=1
      } else if(attendance[studentId] === "absent") {
        counter["absent"]+=1
      }
      return counter
    }, {
      present: 0,
      late: 0,
      absent: 0
    })
    const counts: StateList[] = [
      { type: "all", count: allStudentCount },
      { type: "present", count: otherCounts["present"] },
      { type: "late", count: otherCounts["late"] },
      { type: "absent", count: otherCounts["absent"] },
    ]
    return counts
  }, [attendance])

  const attendenceChangeHandler = (studentId: number, status: string) => {
    setattendance({
      ...attendance,
      [studentId]: status
    })
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          searchValue={search}
          onInputChangeHandler={onInputChangeHandler}
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
                />
              ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        attendenceCounts={attendenceCounts}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  searchValue: string
  sortDetails: string
  onItemClick: (action: ToolbarAction, value?: string) => void
  onInputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { sortDetails, searchValue, onItemClick, onInputChangeHandler } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} className="name-column">
        Name <FontAwesomeIcon icon={sortDetails === "ASC" ? 'sort-down' : 'sort-up'} size="1x" className="sort-icon"/>
      </div>
      <SearchBar
        placeholder="Search"
        value={searchValue}
        onChange={onInputChangeHandler}
      />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    .name-column {
      display: flex;
      cursor: pointer;
      .sort-icon {
        margin-left: 10px;
      }
    }
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
