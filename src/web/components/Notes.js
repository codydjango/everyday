import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import debounce from '~/utilities/debounce'
import Archive from '~/components/Archive'

export default props => {
    const [error, setError] = useState(false)
    const [dirty, setDirty] = useState(false)

    let current = props.notes.current

    const debouncedOnUpdate = debounce(html => {
        current = DOMPurify.sanitize(html)
        setDirty(true)
    }, 100)

    const createMarkup = () => {
        return { __html: current }
    }

    const handleSave = async e => {
        await props.onUpdate({ current, archive: props.notes.archive })
        setDirty(false)
    }

    const handleArchiveSave = async name => {
        const archive = props.notes.archive.slice(0)
        archive.push([name, current])
        await props.onUpdate({ current: '', archive })
        setDirty(false)
    }

    return (<div className="notes">
        <div className="flex">
            <span className="flexLeft"><h4 children="Scratchpad" /></span>
            <span><small children={ (dirty) ? "Unsaved..." : "Saved." } /></span>
        </div>

        <div className={ `notesInput field ${ (error) ? "error" : "" }` }
            contentEditable
            onInput={ e => {
                debouncedOnUpdate(e.currentTarget.innerHTML)
            }}
            onBlur={ handleSave }
            dangerouslySetInnerHTML={ createMarkup() } />
        <Archive
            notes={ props.notes }
            onSave={ handleArchiveSave } />
    </div>)
}
