import React from 'react'
import styled from 'styled-components'
import { withContext } from '~/hoc'
import { StatusContext } from '~/context'

const StyledSmall = styled.small``

export default withContext(({ className, status }) => (<StyledSmall className={ `${ className } status readout` }>{ status }</StyledSmall>), StatusContext)
