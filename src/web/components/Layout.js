import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import produce from 'immer'
import StatusContext from '~/context'

const themes = {
    normal: {
        background: "yellow",
        color: "black",
        border: "green"
    },
    dark: {
        background: "black",
        color: "white",
        border: "blue"
    }
}

// const theme = () => ({
//     main: 'rgb(243, 243, 0)',
//     border: 'rgb(243, 243, 0)'
// })

const StyledDiv = styled.div`
    display: block;
    position: relative;
    padding: 0 8px;
    box-sizing: border-box;
    min-height: 100%;
    min-width: 300px;
    background-color: ${ props => props.theme.background };
    color: ${ props => props.theme.color };
`


class Layout extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            theme: themes.normal,
            themeStyle: 'normal'
        }

        this.setTheme = this.setTheme.bind(this)
    }

    setTheme(themeStyle) {
        this.setState(produce(draft => {
            draft.theme = themes[themeStyle],
            draft.themeStyle = themeStyle
        }))
    }

    render() {
        const { children, ...rest } = this.props

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                themeStyle: this.themeStyle,
                setTheme: this.setTheme,
                ...rest
            })
        )

        return (<ThemeProvider theme={ this.state.theme }>
            <StyledDiv className="layout">
                { childrenWithProps}
            </StyledDiv>
        </ThemeProvider>)
    }
}

Layout.contextType = StatusContext

export default Layout
