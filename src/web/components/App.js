import React from 'react'

import styled from 'styled-components'
import Auth from '~/components/Auth'
import Logo from '~/components/Logo'
import Status from '~/components/Status'
import DataInterface from '~/components/DataInterface'
import Today from '~/components/Today'
import Now from '~/components/Now'
import Scratchpad from '~/components/Scratchpad'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import Activity from '~/components/Activity'
import Settings from '~/components/Settings'

import StatusProvider from '~/providers/StatusProvider'
import AuthProvider  from '~/providers/AuthProvider'
import ListProvider from '~/providers/ListProvider'
import NotesProvider from '~/providers/NotesProvider'
import { withProvider } from '~/hoc'

const Container = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
`

const Body = styled.div`
    flex: 1;
`

const Work = styled.div``

class App extends React.Component {
    render() {
        const { setTheme, themeStyle } = this.props
        return (
            <Container className="container">
                <Header className="header">
                    <Logo />
                    <Auth />
                </Header>

                <Body className="body">
                    <Work className="work">
                        <Now className="now" />
                        <Scratchpad className="scratchpad" />
                        <Activity />
                    </Work>

                    <Today className="today" />
                </Body>

                <Footer className="footer">
                    <Status className="messageLeft" />
                    <DataInterface className="messageRight" />
                    <Settings className="messageRight" themeStyle={ themeStyle } setTheme={ setTheme }/>
                </Footer>
            </Container>
        )
    }
}

export default withProvider(App, [
    StatusProvider,
    AuthProvider,
    ListProvider,
    NotesProvider])
