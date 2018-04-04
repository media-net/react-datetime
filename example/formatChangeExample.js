import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import DateTime from '../DateTime';

class Wrapper extends Component {
    state = {
        dateFormat: 'YYYY-MM-DD'
    };

    componentDidMount = () => {
        setTimeout(this.updateFormat, 3000);
    };

    updateFormat = () => {
        console.log('changing state'); //eslint-disable-line
        this.setState({
            dateFormat: 'DD.MM.YYYY'
        });
    };

    render() {
        console.log('Current viewmode: ' + this.state.viewMode); //eslint-disable-line
        return (
            <DateTime
                dateFormat={this.state.dateFormat}
                timeFormat={false}
                defaultValue={moment()}
            />
        );
    }
}

render(<Wrapper />, document.getElementById('datetime'));
