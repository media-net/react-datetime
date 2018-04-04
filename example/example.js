import DateTime from '../DateTime';
import React from 'react';
import { render } from 'react-dom';

render(
    <DateTime
        dateFormat="DD, MMM YYYY"
        isValidDate={current => {
            return current.isBefore(DateTime.moment().startOf('month'));
        }}
    />,
    document.getElementById('datetime')
);
