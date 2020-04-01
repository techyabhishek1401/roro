import React, { Component } from 'react'

export default class Card extends Component {
    render() {
        return (
            <div className="card-container" >
                <div className="cards">
                    <div className="cards-header"></div>
                    <div className="cards-body">
                        {this.props.children}
                    </div>
                </div>

            </div>
        )
    }
}
