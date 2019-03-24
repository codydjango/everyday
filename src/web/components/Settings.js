import React from 'react'
import Link from '~/components/Link'
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
        const { themeStyle, rotateTheme } = this.props

        return (<StyledDiv>
            <Link children={ themeStyle } onClick={ () => {
                rotateTheme()
            } } />
        </StyledDiv>)
    }
}

export default withTheme(withContext(Settings, [StatusContext]))
