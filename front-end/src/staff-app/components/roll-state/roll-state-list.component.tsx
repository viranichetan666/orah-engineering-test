import React from "react"

// Other library related imports
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Shared
import { Spacing, FontWeight } from "shared/styles/styles"
import { ItemType, StateList } from "shared/models/roll"

// Components
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  stateList: StateList[]
  onItemClick?: (type: ItemType) => void
  size?: number
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, onItemClick }) => {
  // Handlers
  const onClick = (type: ItemType) => {
    if (onItemClick) {
      onItemClick(type)
    }
  }
  return (
    <Styled.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <Styled.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
            </Styled.ListItem>
          )
        }

        return (
          <Styled.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
          </Styled.ListItem>
        )
      })}
    </Styled.ListContainer>
  )
}

const Styled = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}


