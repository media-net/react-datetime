import React, { Component } from 'react';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';

class DateTimePickerDays extends Component {
    /**
     * Get a list of the days of the week
     * depending on the current locale
     * @return {array} A list with the shortname of the days
     */
    getDaysOfWeek(locale) {
        const days = locale._weekdaysMin;
        const first = locale.firstDayOfWeek();
        const dow = [];
        let i = 0;

        days.forEach(day => {
            dow[(7 + i++ - first) % 7] = day;
        });

        return dow;
    }

    renderDays() {
        const date = this.props.viewDate;
        const selected =
            this.props.selectedDate && this.props.selectedDate.clone();
        const prevMonth = date.clone().subtract(1, 'months');
        const currentYear = date.year();
        const currentMonth = date.month();
        const weeks = [];
        let days = [];
        const renderer = this.props.renderDay || this.renderDay;
        const isValid = this.props.isValidDate || this.alwaysValidDate;
        let classes;
        let isDisabled;
        let dayProps;
        let currentDate;

        // Go to the last week of the previous month
        prevMonth.date(prevMonth.daysInMonth()).startOf('week');
        const lastDay = prevMonth.clone().add(42, 'd');

        while (prevMonth.isBefore(lastDay)) {
            classes = 'rdtDay';
            currentDate = prevMonth.clone();

            if (
                (prevMonth.year() === currentYear &&
                    prevMonth.month() < currentMonth) ||
                prevMonth.year() < currentYear
            )
                classes += ' rdtOld';
            else if (
                (prevMonth.year() === currentYear &&
                    prevMonth.month() > currentMonth) ||
                prevMonth.year() > currentYear
            )
                classes += ' rdtNew';

            if (selected && prevMonth.isSame(selected, 'day'))
                classes += ' rdtActive';

            if (prevMonth.isSame(moment(), 'day')) classes += ' rdtToday';

            isDisabled = !isValid(currentDate, selected);
            if (isDisabled) classes += ' rdtDisabled';

            dayProps = {
                key: prevMonth.format('M_D'),
                'data-value': prevMonth.date(),
                className: classes
            };

            if (!isDisabled) dayProps.onClick = this.updateSelectedDate;

            days.push(renderer(dayProps, currentDate, selected));

            if (days.length === 7) {
                weeks.push(<tr key={prevMonth.format('M_D')}>{days}</tr>);
                days = [];
            }

            prevMonth.add(1, 'd');
        }

        return weeks;
    }

    updateSelectedDate = event => {
        this.props.updateSelectedDate(event, true);
    };

    renderDay = (props, currentDate) => {
        return <td {...props}>{currentDate.date()}</td>;
    };

    renderFooter = () => {
        const { timeFormat, selectedDate, viewDate } = this.props;

        if (!timeFormat) return null;

        const date = selectedDate || viewDate;

        return (
            <tfoot>
                <tr>
                    <td
                        className="rdtTimeToggle"
                        colSpan={7}
                        onClick={this.showTimeView}
                    >
                        {date.format(timeFormat)}
                    </td>
                </tr>
            </tfoot>
        );
    };

    alwaysValidDate = () => {
        return 1;
    };

    handleClickOutside = () => {
        this.props.handleClickOutside();
    };

    showTimeView = () => {
        this.props.showView('time');
    };

    showView = () => {
        this.props.showView('months');
    };

    addTime = () => {
        this.props.addTime(1, 'months');
    };

    subtractTime = () => {
        this.props.subtractTime(1, 'months');
    };

    render() {
        const { viewDate: date } = this.props;
        const locale = date.localeData();

        return (
            <div className="rdtDays">
                <table>
                    <thead>
                        <tr>
                            <th className="rdtPrev" onClick={this.subtractTime}>
                                <span>{'<'}</span>
                            </th>
                            <th
                                className="rdtSwitch"
                                onClick={this.showView}
                                colSpan={5}
                                data-value={date.month()}
                            >
                                {locale.months(date)} {date.year()}
                            </th>
                            <th className="rdtNext" onClick={this.addTime}>
                                <span>{'>'}</span>
                            </th>
                        </tr>
                        <tr>
                            {this.getDaysOfWeek(locale).map((day, index) => {
                                return (
                                    <th className="dow" key={day + index}>
                                        {day}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody key="tbody">{this.renderDays()}</tbody>
                    {this.renderFooter()}
                </table>
            </div>
        );
    }
}

export default onClickOutside(DateTimePickerDays);
