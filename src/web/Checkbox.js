import React from 'react'

export default props => <span><input type="checkbox" />{props.item.text}</span>


// class Checkbox extends React.Component {
//     getInitialState() {
//         return {
//             isChecked: false
//         }
//     }

//     toggleCheck() {
//         this.setState({isChecked: !this.state.isChecked});
//     }

//     render() {
//         return (
//             <span onClick={this.toggleCheck}>
//                 <input type="checkbox" checked={this.state.isChecked} />
//                 <span className="item">{ this.props.item }</span>
//             </span>
//         )
//     }
// }
