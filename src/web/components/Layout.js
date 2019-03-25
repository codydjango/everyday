import React from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import produce from 'immer'
import local from '~/services/local'

// .navy { color: #001F3F; }
// .blue { color: #0074D9; }
// .aqua { color: #7FDBFF; }
// .teal { color: #39CCCC; }
// .olive { color: #3D9970; }
// .green { color: #2ECC40; }
// .lime { color: #01FF70; }
// .yellow { color: #FFDC00; }
// .orange { color: #FF851B; }
// .red { color: #FF4136; }
// .fuchsia { color: #F012BE; }
// .purple { color: #B10DC9; }
// .maroon { color: #85144B; }
// .white { color: #FFFFFF; }
// .silver { color: #DDDDDD; }
// .gray { color: #AAAAAA; }
// .black { color: #111111; }

// $backgroundYellow: rgb(243, 243, 0);
// $backgroundYellowBorder: #5c5e00;
// $backgroundYellowBorderFocus: rgb(129, 129, 2);

// $darkBackground: black;
// $darkBorder: #fbff00;
// $darkBorderFocus: rgb(209, 209, 3);


const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${ props => props.theme.primary };
        color: ${ props => props.theme.text };
    }

    p {
        margin-top: 0px;
        padding-top: 0px;
        color: ${ props => props.theme.text };
    }

    a {
        color: ${ props => props.theme.text };
    }
`

const themes = {
    yellow: {
        primary: "#FFDC00",
        secondary: "#F2D000",
        border: "#EFCD00",
        borderActive: "#E4C300",
        borderError: "tomato",
        text: "#111111",
        marginBottom: "14px",
        linkUnderline: "rgba(34, 34, 34, 0.6)",
        transition: "400ms ease-out"
    },
    dark: {
        primary: "#111111",
        secondary: "rgba(50, 50, 52, 1)",
        border: "rgba(90, 90, 92, 1)",
        borderActive: "#EEF0E3",
        borderError: "#340d0d",
        text: "rgba(145, 145, 146, 1)",
        marginBottom: "14px",
        linkUnderline: "rgba(145, 145, 146, 0.8)",
        transition: "400ms ease-out"
    },
    strawberry: {
        primary: "#e06d6d",
        secondary: "#de6363",
        border: "#e06363",
        borderActive: "#FFF",
        borderError: "#d74c4c",
        text: "#FFF",
        marginBottom: "14px",
        linkUnderline: "#EEF0E3B3",
        transition: "400ms ease-out"
    }
}

const INITIALTHEME = 'yellow'

const StyledDiv = styled.div`
    display: block;
    position: relative;
    padding: 0 8px;
    box-sizing: border-box;
    min-height: 100%;
    min-width: 300px;
    background-color: ${ props => props.theme.primary };
    color: ${ props => props.theme.text };
`

class Layout extends React.Component {
    constructor(props) {
        super(props)

        let initialTheme = local.get('theme', INITIALTHEME)
        if (Object.keys(themes).indexOf(initialTheme) === -1) {
            initialTheme = INITIALTHEME
        }

        this.state = {
            theme: themes[initialTheme],
            themeStyle: initialTheme
        }

        this.setTheme = this.setTheme.bind(this)
        this.rotateTheme = this.rotateTheme.bind(this)
    }

    setTheme(themeStyle) {
        local.set('theme', themeStyle)

        this.setState(produce(draft => {
            let theme = Object.assign({}, themes[themeStyle])
            delete theme.transition
            draft.theme = theme
            draft.themeStyle = themeStyle
        }), () => {
            setTimeout(() => this.setState(produce(draft => {
                draft.theme.transition = themes[themeStyle].transition
            })), 1)
        })
    }

    rotateTheme() {
        const themeKeys = Object.keys(themes)
        const index = themeKeys.indexOf(this.state.themeStyle)

        this.setTheme((index === themeKeys.length - 1) ? themeKeys[0] : themeKeys[index + 1] )
    }

    render() {
        const { children, ...rest } = this.props

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                themeStyle: this.state.themeStyle,
                setTheme: this.setTheme,
                rotateTheme: this.rotateTheme,
                ...rest
            })
        )

        return (<ThemeProvider theme={ this.state.theme }>
            <React.Fragment>
                <StyledDiv className="layout">
                    { childrenWithProps}
                </StyledDiv>
                <GlobalStyle />
            </React.Fragment>
        </ThemeProvider>)
    }
}

export default Layout
