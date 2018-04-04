import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import DateTime from '../DateTime';

class Wrapper extends Component {
    state = {
        viewmode: 'time'
    };

    componentDidMount = () => {
        setTimeout(this.updateView, 3000);
    };

    updateView = () => {
        console.log('changing viewMode to days'); //eslint-disable-line
        this.setState({
            viewMode: 'days'
        });
    };

    render() {
        console.log('Current viewmode: ' + this.state.viewMode); //eslint-disable-line
        return (
            <DateTime viewMode={this.state.viewmode} defaultValue={moment()} />
        );
    }
}

render(<Wrapper />, document.getElementById('datetime'));
