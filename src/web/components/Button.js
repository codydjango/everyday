import React from 'react'

export default React.forwardRef(( props, ref) => {
    return (<button
        ref={ ref }
        id={ props.id }
        onClick={ props.action }>{ props.text }</button>)
})
