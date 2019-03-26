import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .message {
        text-align: center;
        margin: 0 auto;
    }

    .messageLine {
        display: block;
    }
`

export default ({ children, theme }) => {
    const bar = (Array(...Array(children[0].length).keys()).map(i => '#').join(''))
    return (<StyledDiv>
        <div className="message">
            <span className="messageLine">{ bar }</span>
            { children }
            <span className="messageLine">{ bar }</span>
        </div>
    </StyledDiv>)
}
