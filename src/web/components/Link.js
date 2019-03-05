import React from 'react'

export default props => {
    const { className, ...modifiedProps } = props

    return (<a
        href="#"
        className={ `link ${ (className) ? className : '' }` }
        { ...modifiedProps }>
        { props.text }</a>)
}
