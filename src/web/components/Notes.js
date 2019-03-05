import React, { useState } from 'react'

export default props => {
    const [error, setError] = useState(false)

    return (<div className={ `notes field ${ (error) ? "error" : "" }` }>
        <h4>Scratchpad (not saved)</h4>
        <div contentEditable></div>
    </div>)
}
