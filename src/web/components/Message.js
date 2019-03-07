import React from 'react'

export default ({ children }) => (
    <div className="container messageScreen">
        <div className="message">
            <span className="messageLine">################################################################</span>
            { children }
            <span className="messageLine">################################################################</span>
        </div>
    </div>)
