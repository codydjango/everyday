import React from 'react'
import styled from 'styled-components'

const StyledLink = styled.a`
    display: inline-block;
    padding: 0;
    margin: 0 2px;
    position: relative;
    color: ${ props => props.theme.text };
    text-decoration: none;
    overflow: auto;

    &::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 1px;
        background: ${ props => props.theme.linkUnderline };
        transition: height,
        margin-top .2s;
        margin-top: -3px;
    }

    &:hover::after {
        height: 2px;
        margin-top: -1px;
    }

    &:focus::after {
        height: 2px;
        margin-top: -1px;
    }
`

export default props => {
    const { className, children, onClick, ...modifiedProps } = props

    return (<StyledLink
        href="#"
        tabIndex="0"
        role="button"
        className={ `link ${ (className) ? className : '' }` }
        onKeyPress={ e => { if (e.key === 'Enter') onClick() }}
        onClick={ onClick }
        { ...modifiedProps }>
        { children }
    </StyledLink>)
}
