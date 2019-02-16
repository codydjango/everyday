import React from 'react'

export default ({ action, ...props }) => <button onClick={ action } {...props}>{ props.text }</button>
