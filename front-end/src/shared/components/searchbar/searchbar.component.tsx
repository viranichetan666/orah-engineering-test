import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { InputHTMLAttributes } from "react"
import { BorderRadius, Spacing } from "shared/styles/styles"
import styled from "styled-components"

interface SearchInputTypes {
  onClose?: () => void
  showClose?: boolean
}

export const SearchBar: React.FC<InputHTMLAttributes<HTMLInputElement> & SearchInputTypes> = (
  props
) => {
  const { showClose, onClose } = props
  return (
    <S.SearchContainer>
      <S.Input type="text" {...props} />
      {
        showClose && props.value && props.value !== "" &&
        <FontAwesomeIcon icon="window-close"  className="close-icon" onClick={onClose}/>
      }
    </S.SearchContainer>
  )
}

const S = {
  SearchContainer: styled.div`
  position: relative;
    .close-icon {
      position: absolute;
      right: 5px;
      z-index: 4;
      color: #343f64;
      top: 7px;
      cursor: pointer;
    }
  `,
  Input: styled.input`
    border-radius: ${BorderRadius.default};
    &:focus-visible {
      outline: none;
    }
    border-color: transparent;
    padding: ${Spacing.u1};
  `,
}
