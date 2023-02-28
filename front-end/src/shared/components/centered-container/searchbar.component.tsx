import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { InputHTMLAttributes } from "react"
import { BorderRadius, Spacing } from "shared/styles/styles"
import styled from "styled-components"

export const SearchBar: React.FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <React.Fragment>
      <S.Input type="text" {...props} />
      <FontAwesomeIcon icon="window-close" />
    </React.Fragment>
  )
}

const S = {
  Input: styled.input`
    border-radius: ${BorderRadius.default};
    &:focus-visible {
      outline: none;
    }
    border-color: transparent;
    padding: ${Spacing.u1};
  `,
}
