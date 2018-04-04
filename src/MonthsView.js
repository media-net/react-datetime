import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

class DateTimePickerMonths extends Component {
    renderMonths = () => {
        const {
            selectedDate: date,
            viewDate,
            renderMonth,
            isValidDate
        } = this.props;
        const month = viewDate.month();
        const year = viewDate.year();
        let rows = [];
        let i = 0;
        let months = [];
        const renderer = renderMonth || this.renderMonth;
        const isValid = isValidDate || this.alwaysValidDate;
        let classes,
            props,
            currentMonth,
            isDisabled,
            noOfDaysInMonth,
            daysInMonth,
            validDay,
            // Date is irrelevant because we're only interested in month
            irrelevantDate = 1;

        while (i < 12) {
            classes = 'rdtMonth';
            currentMonth = this.props.viewDate
                .clone()
                .set({ year: year, month: i, date: irrelevantDate });

            noOfDaysInMonth = currentMonth.endOf('month').format('D');
            daysInMonth = Array.from({ length: noOfDaysInMonth }, (_, i) => {
                return i + 1;
            });

            validDay = daysInMonth.find(d => {
                let day = currentMonth.clone().set('date', d);
                return isValid(day);
            });

            isDisabled = validDay === undefined;

            if (isDisabled) classes += ' rdtDisabled';

            if (date && i === date.month() && year === date.year())
                classes += ' rdtActive';

            props = {
                key: i,
                'data-value': i,
                className: classes
            };

            if (!isDisabled)
                props.onClick =
                    this.props.updateOn === 'months'
                        ? this.updateSelectedMonth
                        : this.props.setDate('month');

            months.push(renderer(props, i, year, date && date.clone()));

            if (months.length === 4) {
                rows.push(<tr key={`${month}_${rows.length}`}>{months}</tr>);
                months = [];
            }
            i++;
        }

        return rows;
    };

    updateSelectedMonth = event => {
        this.props.updateSelectedDate(event);
    };

    renderMonth = (props, month) => {
        let localMoment = this.props.viewDate;
        let monthStr = localMoment
            .localeData()
            .monthsShort(localMoment.month(month));
        let strLength = 3;
        // Because some months are up to 5 characters long, we want to
        // use a fixed string length for consistency
        let monthStrFixedLength = monthStr.substring(0, strLength);
        return <td {...props}>{capitalize(monthStrFixedLength)}</td>;
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
        this.props.addTime(1, 'years');
    };

    subtractTime = () => {
        this.props.subtractTime(1, 'years');
    };

    render() {
        const { prev, next, viewDate } = this.props;
        return (
            <div className="rdtMonths">
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
                                data-value={viewDate.year()}
                            >
                                {viewDate.year()}
                            </th>
                            <th className="rdtNext" onClick={this.addTime}>
                                <span>{next || '>'}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{this.renderMonths()}</tbody>
                </table>
            </div>
        );
    }
}

export default onClickOutside(DateTimePickerMonths);
