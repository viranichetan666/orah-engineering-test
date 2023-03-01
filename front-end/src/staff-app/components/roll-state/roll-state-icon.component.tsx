import React from "react"

// Other library related 
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Shared
import { BorderRadius } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { roleState, RollStateType } from "shared/models/roll"

interface Props {
  type: RollStateType
  size?: number
  onClick?: () => void
}
export const RollStateIcon: React.FC<Props> = (props) => {
  const { type, size = 20, onClick } = props
  return (
    <Styled.Icon size={size} border={type === "unmark"} bgColor={getBgColor(type)} clickable={Boolean(onClick)} onClick={onClick}>
      <FontAwesomeIcon icon="check" size={size > 14 ? "lg" : "sm"} />
    </Styled.Icon>
  )
}

function getBgColor(type: RollStateType) {
  switch (type) {
    case roleState.UNMARK:
      return Colors.neutral.white
    case roleState.PRESENT:
      return Colors.success.darker
    case roleState.ABSENT:
      return Colors.grey.darker
    case roleState.LATE:
      return Colors.warning.darker
    default:
      return Colors.success.darker
  }
}

const Styled = {
  Icon: styled.div<{ size: number; border: boolean; bgColor: string; clickable: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${Colors.neutral.white};
    background-color: ${({ bgColor }) => bgColor};
    border: 2px solid ${({ border }) => (border ? Colors.dark.lighter : "transparent")};
    border-radius: ${BorderRadius.rounded};
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    cursor: ${({ clickable }) => (clickable ? "pointer" : undefined)};
  `,
}
