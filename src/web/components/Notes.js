import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import debounce from '~/utilities/debounce'
import Button from '~/components/Button'

export default props => {
    const [error, setError] = useState(false)
    const [dirty, setDirty] = useState(false)

    let notes = props.notes

    const debouncedOnUpdate = debounce((html) => {
        notes = html
        setDirty(true)
    }, 100)

    const createMarkup = () => {
        return { __html: notes }
    }

    const handleSave = async e => {
        let here = await props.onUpdate(DOMPurify.sanitize(notes))
        setDirty(false)
    }

    return (<div className={ `notes field ${ (error) ? "error" : "" }` }>
        <h4>Scratchpad</h4>
        <div className="notesInput"
            contentEditable
            onInput={ e => {
                debouncedOnUpdate(e.currentTarget.innerHTML)
            }}
            onBlur={ handleSave }
            dangerouslySetInnerHTML={ createMarkup() } />
        <span className="readout"><small children={ (dirty) ? "Unsaved..." : "Saved." } /></span>
    </div>)
}
