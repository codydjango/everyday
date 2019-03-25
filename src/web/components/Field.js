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
    background-color: ${ props => props.theme.secondary };
    width: 100%;
    max-width: 300px;
    border: 1px solid ${ props => props.theme.border };
    color: ${ props => props.theme.text };

    ${ props => (props.theme.transition) ? `transition : border ${ props.theme.transition };` : '' }

    &:focus {
        outline: none;
        border: 1px solid ${ props => props.theme.borderActive };
    }

    &.error {
        border-color: ${ props => props.theme.borderError };
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
            onBlur={ props.onBlur || noop }
            placeholder={ props.placeholder || '' } />
    </StyledField>)
})
