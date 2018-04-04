import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

class DateTimePickerYears extends Component {
    renderYears = year => {
        const { renderYear, selectedDate, isValidDate, viewDate } = this.props;
        let years = [];
        let i = -1;
        let rows = [];
        let renderer = renderYear || this.renderYear;
        let isValid = isValidDate || this.alwaysValidDate;
        let classes;
        let props;
        let currentYear;
        let isDisabled;
        let noOfDaysInYear;
        let daysInYear;
        let validDay;
        // Month and date are irrelevant here because
        // we're only interested in the year
        let irrelevantMonth = 0;
        let irrelevantDate = 1;

        year--;
        while (i < 11) {
            classes = 'rdtYear';
            currentYear = viewDate.clone().set({
                year,
                month: irrelevantMonth,
                date: irrelevantDate
            });

            // Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
            // if ( i === -1 | i === 10 )
            // classes += ' rdtOld';

            noOfDaysInYear = currentYear.endOf('year').format('DDD');
            daysInYear = Array.from(
                { length: noOfDaysInYear },
                (e, i) => i + 1
            );

            validDay = daysInYear.find(d => {
                let day = currentYear.clone().dayOfYear(d);
                return isValid(day);
            });

            isDisabled = validDay === undefined;

            if (isDisabled) {
                classes += ' rdtDisabled';
            }

            if (selectedDate && selectedDate.year() === year) {
                classes += ' rdtActive';
            }

            props = {
                key: year,
                'data-value': year,
                className: classes
            };

            if (!isDisabled) {
                props.onClick =
                    this.props.updateOn === 'years'
                        ? this.updateSelectedYear
                        : this.props.setDate('year');
            }

            years.push(
                renderer(props, year, selectedDate && selectedDate.clone())
            );

            if (years.length === 4) {
                rows.push(<tr key={i}>{years}</tr>);
                years = [];
            }

            year++;
            i++;
        }

        return rows;
    };

    updateSelectedYear = event => {
        this.props.updateSelectedDate(event);
    };

    renderYear = (props, year) => {
        return <td {...props}>{year}</td>;
    };

    alwaysValidDate = () => {
        return 1;
    };

    handleClickOutside = () => {
        this.props.handleClickOutside();
    };

    showView = () => {
        this.props.showView('years');
    };

    addTime = () => {
        this.props.addTime(10, 'years');
    };

    subtractTime = () => {
        this.props.subtractTime(10, 'years');
    };

    render() {
        const { viewDate, prev, next } = this.props;
        let year = parseInt(viewDate.year() / 10, 10) * 10;

        return (
            <div className="rdtYears">
                <table>
                    <thead>
                        <tr>
                            <th className="rdtPrev" onClick={this.subtractTime}>
                                <span>{prev || '<'}</span>
                            </th>
                            <th
                                className="rdtSwitch"
                                onClick={this.showView}
                                colSpan={2}
                            >
                                {year}-{year + 9}
                            </th>
                            <th className="rdtNext" onClick={this.addTime}>
                                <span>{next || '>'}</span>
                            </th>
                        </tr>
                    </thead>
                </table>
                <table>
                    <tbody>{this.renderYears(year)}</tbody>
                </table>
            </div>
        );
    }
}

export default onClickOutside(DateTimePickerYears);
