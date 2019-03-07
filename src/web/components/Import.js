import React, { useState } from 'react'

export default props => {
    const [input, setInput] = useState(false)

    const startImport = importFile => {
        const reader = new FileReader()

        reader.onload = e => {
            props.onImport(JSON.parse(e.target.result), importFile.name)
            setShow(false)
        }

        reader.readAsText(importFile)
    }

    const handleClick = (e) => {
        input.click(e)
    }

    return (<span className="import">
        <input
            ref={ (ref) => setInput(ref) }
            type="file"
            name="importjson"
            id="importfile"
            className="inputfile"
            onChange={ e => startImport(e.target.files[0]) } />
        <label
            htmlFor="importjson"
            tabIndex="0"
            className="link"
            onKeyPress={ e => { if (e.key === 'Enter') handleClick(e) }}
            onClick={ handleClick }>
            import</label>
    </span>)
}
