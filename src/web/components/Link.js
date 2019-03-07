import React from 'react'

export default props => {
    const { className, onClick, ...modifiedProps } = props

    return (<a
        href="#"
        tabIndex="0"
        role="button"
        className={ `link ${ (className) ? className : '' }` }
        onKeyPress={ e => { if (e.key === 'Enter') onClick() }}
        onClick={ onClick }
        { ...modifiedProps }>
        { props.text }</a>)
}
