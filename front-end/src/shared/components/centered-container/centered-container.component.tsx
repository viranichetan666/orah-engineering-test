import React from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"

interface Props {
  padding?: string
}

export const CenteredContainer: React.FC<Props> = ({ padding = "60px", children }) => (
  <Styled.Container>
    <Styled.Centered padding={padding}>{children}</Styled.Centered>
  </Styled.Container>
)

const Styled = {
  Container: styled.div`
    display: flex;
  `,
  Centered: styled.div<{ padding: string }>`
    width: 100%;
    margin: ${Spacing.u4} 0;
    padding: ${({ padding }) => padding};
    text-align: center;
  `,
}
