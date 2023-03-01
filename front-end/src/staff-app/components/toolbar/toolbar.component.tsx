import React, { useState, useEffect, useMemo } from "react"

// Other libraries related imports
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Components
import { SearchBar } from "shared/components/searchbar/searchbar.component"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { ToolbarAction } from "shared/models/roll"

interface ToolbarProps {
  searchValue: string
  sortDetails: string
  onItemClick: (action: ToolbarAction, value?: string) => void
  setSearch: (searchText: string) => void
}
export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { sortDetails, searchValue, onItemClick, setSearch } = props

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <Styled.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} className="name-column">
        Name <FontAwesomeIcon icon={sortDetails === "ASC" ? 'sort-down' : 'sort-up'} size="1x" className="sort-icon"/>
      </div>
      <SearchBar
        placeholder="Search"
        value={searchValue}
        onChange={onInputChangeHandler}
        showClose
        onClose={() => setSearch("")}
      />
      <Styled.Button onClick={() => onItemClick("roll")}>Start Roll</Styled.Button>
    </Styled.ToolbarContainer>
  )
}

const Styled = {
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
