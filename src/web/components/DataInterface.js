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

    .link {
        display: inline-block;
        padding: 0;
        margin: 0 2px;
        position: relative;
        color: ${ props => props.theme.text };
        text-decoration: none;
        overflow: auto;

        &::after {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 1px;
            background: ${ props => props.theme.linkUnderline };
            transition: height,
            margin-top .2s;
            margin-top: -3px;
        }

        &:hover::after {
            height: 2px;
            margin-top: -1px;
        }

        &:focus::after {
            height: 2px;
            margin-top: -1px;
        }
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
            ? ( <React.Fragment>
                    <Import onImport={ handleImport }/>
                    <a className="link" download="export.json" href={ getHref() }>export</a>
                </React.Fragment>)
            : ''
            }
        </StyledDataInterface>)
    }
}

export default withContext(DataInterface, [AuthContext, ListContext, NotesContext])
