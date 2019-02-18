import React from 'react'

export default ({ action, ...props }) => (<a href="#" className="link" onClick={ (e) => { action() } }>{ props.text }</a>)
