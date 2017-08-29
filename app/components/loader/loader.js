import React from 'react';
import './_loader.scss';
export default class Loader extends React.Component {
    render() {
        return (
            <div styleName="loader-container">
                <div styleName={"loader slow-loader " + (this.props.classList || "normal")}></div>
                {this.props.overlay && (<div styleName="background-overlay"></div>)}
            </div>
        );
    }
}
