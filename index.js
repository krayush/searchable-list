import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

console.log("Testing");
console.log("Testing");
console.log("Testing");
console.log("Testing");
console.log("Testing");

render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);

