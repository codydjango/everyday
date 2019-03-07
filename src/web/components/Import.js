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

    return (<span className="import link">
        <input
            ref={ (ref) => setInput(ref) }
            type="file"
            name="importjson"
            id="importfile"
            className="inputfile"
            onChange={ e => startImport(e.target.files[0]) } />
        <label
            htmlFor="importjson"
            onClick={ e => {
                input.click(e)
            }}>import</label>
    </span>)
}
