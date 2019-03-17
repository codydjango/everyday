import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
    display: block;
    position: relative;
    padding: 0 8px;
    box-sizing: border-box;
    min-height: 100%;
    min-width: 300px;
`

export default props => (
    <StyledDiv className="layout" { ...props } />
)
