import React from 'react'

import styled from 'styled-components'
import Import from '~/components/Import'
import store from '~/services/store'
import { withContext } from '~/hoc'
import { ListContext, NotesContext, AuthContext } from '~/context'

const StyledDataInterface = styled.small`
    span {
        display: inline-block;
        overflow: hidden;
    }
`

class DataInterface extends React.Component {
    render() {
        const handleImport = (data, source) => {
            if (data.list) this.props.updateList(data.list, false)
            if (data.notes) this.props.updateNotes(data.notes, false)

            store.status.updateStatus(`Loaded from ${ source }.`)
        }

        const hasData = () => {
            return this.props.list && this.props.notes
        }

        const allData = () => {
            return {
                list: this.props.list,
                notes: this.props.notes
            }
        }

        const getHref = () => {
            const json = JSON.stringify(allData(), null, 2)
            const encoded = encodeURIComponent(json)

            return `data:application/octet-stream,${ encoded }`
        }

        const className = this.props.className || ''

        return (<StyledDataInterface className={ className }>
            { (hasData())
            ? ( <span>
                    <Import onImport={ handleImport }/>
                    <a className="link" download="export.json" href={ getHref() }>export</a>
                </span>)
            : ''
            }
        </StyledDataInterface>)
    }
}

export default withContext(DataInterface, [AuthContext, ListContext, NotesContext])
