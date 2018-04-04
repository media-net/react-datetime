import React, { Component } from 'react';
import DaysView from './DaysView';
import MonthsView from './MonthsView';
import YearsView from './YearsView';
import TimeView from './TimeView';

class CalendarContainer extends Component {
    static viewComponents = {
        days: DaysView,
        months: MonthsView,
        years: YearsView,
        time: TimeView
    };

    render() {
        const { view, viewProps } = this.props;
        const View = CalendarContainer.viewComponents[view];
        return <View {...viewProps} />;
    }
}

export default CalendarContainer;
