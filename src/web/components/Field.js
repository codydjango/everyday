import React from 'react'
import styled from 'styled-components'

const StyledField = styled.div`
    width: 100%;
    flex: 1;
    padding: 0;
    margin: 0;
`

const StyledLabel = styled.label`
    display: none;
`

const StyledInput = styled.input`
    background-color: rgb(243, 243, 0);
    transition : border 500ms ease-out;
    width: 100%;
    max-width: 300px;
    border: 1px solid rgb(243, 243, 0);

    &:focus {
        outline: none;
        border: 1px solid rgb(209, 209, 5);
    }

    &.error {
        border-color: tomato;
    }
`

const noop = () => {}
export default React.forwardRef((props, ref) => {
    return (
    <StyledField className={ `field ${ props.className || '' }` }>
        <StyledLabel
            htmlFor={ props.name } children={ props.label || props.name } />
        <StyledInput
            type="text"
            className={ (props.error) ? 'error' : '' }
            ref={ ref }
            name={ props.name }
            onChange={ props.onChange || noop }
            onKeyPress={ props.onKeyPress || noop }
            placeholder={ props.placeholder || '' } />
    </StyledField>)
})
