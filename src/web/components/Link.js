import React from 'react'

export default ({ action, ...props }) => (<a href="#" onClick={ (e) => { action() } }><p>{ props.text }</p></a>)
