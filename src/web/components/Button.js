import React from 'react'

export default React.forwardRef(( props, ref) => {
    return (<button
        className={ `button ${ (props.className) ? props.className : '' }` }
        ref={ ref }
        onClick={ props.action }>{ props.text }</button>)
})
