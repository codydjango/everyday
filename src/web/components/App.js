import React from 'react'

import styled from 'styled-components'
import Auth from '~/components/Auth'
import Logo from '~/components/Logo'
import Status from '~/components/Status'
import DataInterface from '~/components/DataInterface'
import Today from '~/components/Today'
import Now from '~/components/Now'
import Scratchpad from '~/components/Scratchpad'
import Footer from '~/components/Footer'

import StatusProvider from '~/providers/StatusProvider'
import AuthProvider  from '~/providers/AuthProvider'
import ListProvider from '~/providers/ListProvider'
import NotesProvider from '~/providers/NotesProvider'
import { withProvider } from '~/hoc'

const Body = styled.div``
const Header = styled.header``
const Work = styled.div``

class App extends React.Component {

    constructor(props) {
        super(props)
        // this.createSession = this.createSession.bind(this)
    }

    render() {
        return (
            <React.Fragment>
                <Header className="header">
                    <Logo />
                    <Auth />
                </Header>

                <Body className="body">
                    <Work className="work">
                        <Now className="now" />
                        <Scratchpad className="scratchpad" />
                    </Work>

                    <Today className="today" />
                </Body>

                <Footer className="footer">
                    <span className="messageLeft"><Status /></span>
                    <span className="messageRight"><DataInterface /></span>
                </Footer>
            </React.Fragment>
        )
    }
}

export default withProvider(App, [
    StatusProvider,
    AuthProvider,
    ListProvider,
    NotesProvider])
