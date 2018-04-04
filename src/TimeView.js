import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

const defaultTimeConstraints = {
    hours: {
        min: 0,
        max: 23,
        step: 1
    },
    minutes: {
        min: 0,
        max: 59,
        step: 1
    },
    seconds: {
        min: 0,
        max: 59,
        step: 1
    },
    milliseconds: {
        min: 0,
        max: 999,
        step: 1
    }
};

class DateTimePickerTime extends Component {
    constructor(props) {
        super(props);
        this.state = this.calculateState(props);
    }

    componentWillMount() {
        this.timeConstraints = defaultTimeConstraints;
        if (this.props.timeConstraints) {
            ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(type => {
                this.timeConstraints = {
                    ...this.timeConstraints,
                    [type]: {
                        ...this.timeConstraints[type],
                        ...this.props.timeConstraints[type]
                    }
                };
            });
        }
        this.setState(this.calculateState(this.props));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeConstraints) {
            ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(type => {
                this.timeConstraints = {
                    ...this.timeConstraints,
                    [type]: {
                        ...this.timeConstraints[type],
                        ...this.props.timeConstraints[type]
                    }
                };
            });
        } else {
            this.timeConstraints = defaultTimeConstraints;
        }
        this.setState(this.calculateState(nextProps));
    }

    padValues = {
        hours: 1,
        minutes: 2,
        seconds: 2,
        milliseconds: 3
    };

    calculateState = props => {
        const date = props.selectedDate || props.viewDate;
        const format = props.timeFormat;
        const counters = [];

        if (format.toLowerCase().includes('h')) {
            counters.push('hours');
            if (format.includes('m')) {
                counters.push('minutes');
                if (format.includes('s')) {
                    counters.push('seconds');
                }
            }
        }

        const hours = date.format('H');

        let daypart = false;
        if (
            this.state !== null &&
            this.props.timeFormat.toLowerCase().includes(' a')
        ) {
            if (this.props.timeFormat.includes(' A')) {
                daypart = hours >= 12 ? 'PM' : 'AM';
            } else {
                daypart = hours >= 12 ? 'pm' : 'am';
            }
        }

        return {
            hours,
            minutes: date.format('mm'),
            seconds: date.format('ss'),
            milliseconds: date.format('SSS'),
            daypart,
            counters
        };
    };

    renderCounter = type => {
        if (type !== 'daypart') {
            let value = this.state[type];
            if (
                type === 'hours' &&
                this.props.timeFormat.toLowerCase().includes(' a')
            ) {
                value = (value - 1) % 12 + 1;

                if (value === 0) {
                    value = 12;
                }
            }
            return (
                <div key={type} className="rdtCounter">
                    <span
                        className="rdtBtn"
                        onMouseDown={this.onStartClicking('increase', type)}
                        onTouchStart={this.onStartClicking('increase', type)}
                        onContextMenu={this.disableContextMenu}
                    >
                        {this.props.upArrow || '▲'}
                    </span>
                    <div className="rdtCount">{value}</div>
                    <span
                        className="rdtBtn"
                        onMouseDown={this.onStartClicking('decrease', type)}
                        onTouchStart={this.onStartClicking('decrease', type)}
                        onContextMenu={this.disableContextMenu}
                    >
                        {this.props.downArrow || '▼'}
                    </span>
                </div>
            );
        }
        return '';
    };

    renderDayPart = () => {
        return (
            <div className="rdtCounter" key="daypart">
                <span
                    className="rdtBtn"
                    onMouseDown={this.onStartClicking('toggleDayPart', 'hours')}
                    onTouchStart={this.onStartClicking('increase', 'hours')}
                    onContextMenu={this.disableContextMenu}
                >
                    {this.props.upArrow || '▲'}
                </span>
                <div className="rdtCount">{this.state.daypart}</div>
                <span
                    className="rdtBtn"
                    onMouseDown={this.onStartClicking('toggleDayPart', 'hours')}
                    onTouchStart={this.onStartClicking('decrease', 'hours')}
                    onContextMenu={this.disableContextMenu}
                >
                    {this.props.downArrow || '▼'}
                </span>
            </div>
        );
    };

    updateMilli = e => {
        const milli = parseInt(e.target.value, 10);
        if (milli === e.target.value && milli >= 0 && milli < 1000) {
            this.props.setTime('milliseconds', milli);
            this.setState({ milliseconds: milli });
        }
    };

    showDaysView = () => {
        this.props.showView('days');
    };

    renderHeader = () => {
        const { dateFormat, selectedDate, viewDate } = this.props;
        if (!dateFormat) return null;
        const date = selectedDate || viewDate;

        return (
            <thead>
                <tr>
                    <th
                        className="rdtSwitch"
                        colSpan={4}
                        onClick={this.showDaysView}
                    >
                        {date.format(dateFormat)}
                    </th>
                </tr>
            </thead>
        );
    };

    onStartClicking = (action, type) => {
        return () => {
            const update = {};
            update[type] = this[action](type);
            this.setState(update);

            this.timer = setTimeout(() => {
                this.increaseTimer = setInterval(() => {
                    update[type] = this[action](type);
                    this.setState(update);
                }, 70);
            }, 500);

            this.mouseUpListener = () => {
                clearTimeout(this.timer);
                clearInterval(this.increaseTimer);
                this.props.setTime(type, this.state[type]);
                document.body.removeEventListener(
                    'mouseup',
                    this.mouseUpListener
                );
                document.body.removeEventListener(
                    'touchend',
                    this.mouseUpListener
                );
            };

            document.body.addEventListener('mouseup', this.mouseUpListener);
            document.body.addEventListener('touchend', this.mouseUpListener);
        };
    };

    disableContextMenu = event => {
        event.preventDefault();
        return false;
    };

    toggleDayPart = type => {
        // type is always 'hours'
        let value = parseInt(this.state[type], 10) + 12;
        if (value > this.timeConstraints[type].max)
            value =
                this.timeConstraints[type].min +
                (value - (this.timeConstraints[type].max + 1));
        return this.pad(type, value);
    };

    increase = type => {
        let value =
            parseInt(this.state[type], 10) + this.timeConstraints[type].step;
        if (value > this.timeConstraints[type].max)
            value =
                this.timeConstraints[type].min +
                (value - (this.timeConstraints[type].max + 1));
        return this.pad(type, value);
    };

    decrease = type => {
        let value =
            parseInt(this.state[type], 10) - this.timeConstraints[type].step;
        if (value < this.timeConstraints[type].min)
            value =
                this.timeConstraints[type].max +
                1 -
                (this.timeConstraints[type].min - value);
        return this.pad(type, value);
    };

    pad = (type, value) => {
        let str = `${value}`;
        while (str.length < this.padValues[type]) str = `0${str}`;
        return str;
    };

    handleClickOutside = () => {
        this.props.handleClickOutside();
    };

    render() {
        const { daypart, counters } = this.state;
        let children = [];
        const { timeFormat } = this.props;

        counters.forEach(c => {
            if (children.length) {
                children.push(
                    <div
                        className="rdtCounterSeparator"
                        key={`sep${children.length}`}
                    >
                        :
                    </div>
                );
            }
            children.push(this.renderCounter(c));
        });

        if (daypart) {
            children.push(this.renderDayPart());
        }

        if (counters.length === 3 && timeFormat.includes('S')) {
            children.push(
                <div
                    className="rdtCounterSeparator"
                    key={`sep${children.length}`}
                >
                    :
                </div>
            );
            children.push(
                <div className="rdtCounter rdtMilli" key="m">
                    <input
                        value={this.state.milliseconds}
                        type="text"
                        onChange={this.updateMilli}
                    />
                </div>
            );
        }

        return (
            <div className="rdtTime">
                <table>
                    {this.renderHeader()}
                    <tbody>
                        <tr>
                            <td>
                                <div className="rdtCounters">{children}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default onClickOutside(DateTimePickerTime);
