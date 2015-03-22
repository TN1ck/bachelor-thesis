import React from 'react';
import ReactApp from './main.js';

// React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

React.render(<ReactApp/>, document.getElementById('react'));
