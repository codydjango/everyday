import React from 'react'

// import Mine from '~/components/Mine'
// import Next from '~/components/Next'

import Header from '~/components/Header'
import Footer from '~/components/Footer'
import Auth from '~/components/Auth'
import Logo from '~/components/Logo'
import Status from '~/components/Status'
// import Message from '~/components/Message'
// import Import from '~/components/Import'
// import remote from '~/services/remote'
// import local from '~/services/local'
// import { messages, randomFromList } from '~/services/messages'
// import { DEFAULTLIST, CODYLIST } from '~/settings'
// import uniqueId from '~/utilities/uniqueId'

import { StatusContext, AuthenticationContext, ListContext, NotesContext } from '~/context'
import { StatusProvider, AuthenticationProvider, ListProvider, NotesProvider } from '~/providers'
import { withContext, withProvider } from '~/hoc'

class App extends React.Component {

    constructor(props) {
        super(props)

        // this.doneRef = React.createRef()

        // // handlers
        // this.handleReset = this.handleReset.bind(this)
        // this.handleClearDone = this.handleClearDone.bind(this)
        // this.handleSetActive = this.handleSetActive.bind(this)
        // this.createSession = this.createSession.bind(this)

        // this.load = this.load.bind(this)
        // this.import = this.import.bind(this)
        // this.save = this.save.bind(this)

        // // callback
        // this.updateList = this.updateList.bind(this)
        // this.updateNotes = this.updateNotes.bind(this)
    }

    setStatus(status) {
        this.context.updateStatus(status)
    }

    render() {
        return (
            <React.Fragment>
                <Header >
                    <Logo />
                    <Auth />
                </Header>

                <Footer>
                    <Status />
                </Footer>
            </React.Fragment>
        )
    }
}

export default withProvider(App, [
    StatusProvider,
    AuthenticationProvider,
    ListContext,
    NotesProvider])
