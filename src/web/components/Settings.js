import React from 'react'
import Button from '~/components/Button'
import styled, { withTheme } from 'styled-components'
import { withContext } from '~/hoc'
import { StatusContext } from '~/context'

const StyledDiv = styled.small`
    span {
        display: inline-block;
        overflow: hidden;
    }
`

class Settings extends React.Component {
    render() {
        const { themeStyle, setTheme } = this.props
        const nextTheme = (themeStyle === 'dark' ? 'normal' : 'dark')
        console.log('here', themeStyle, nextTheme)
        return (<StyledDiv>
            <Button text={ nextTheme } action={ e => {
                setTheme(nextTheme)
            } } />
        </StyledDiv>)
    }
}

export default withTheme(withContext(Settings, [StatusContext]))
