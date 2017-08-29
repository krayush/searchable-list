import React from 'react';
import './_searchable-dropdown.scss';
import { debounce } from '../../services/utilities';

export default class SearchableDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInputActive: false,
            isSuggestionsVisible: false
        }
        this._onKeyUp = this.onKeyUp.bind(this);
        this._onFocus = this.onFocus.bind(this);
        this._onBlur = this.onBlur.bind(this);
        //this.onKeyHandler = debounce(() => {
        this.onKeyHandler = () => {
            var value = this.input.value.trim();
            this.setState({
                isSuggestionsVisible: !!value
            });
        }, 500;
    }
    componentWillReceiveProps(nextProps) {
        if(!(nextProps.options && nextProps.options.length)) {
            this.input.value = "";
        }
    }
    onKeyUp() {
        this.onKeyHandler();
    }
    onFocus() {
        this.setState({
            isInputActive: true
        });
        if(this.input.value.trim()) {
            this.setState({
                isSuggestionsVisible: true
            });
        }
    }
    onBlur() {
        this.setState({
            isInputActive: false,
            isSuggestionsVisible: false
        });
        this.props.onSelect(this.input.value);
    }
    render() {
        var searchValue = "";
        if(this.input) {
            searchValue = this.input.value.toLowerCase();
        }
        var optionsContent = (this.props.options || []).map((value, index) => {
            if(value.toLowerCase().indexOf(searchValue) > -1) {
                return (<li key={index} onMouseDown={() => {
                    this.props.onSelect(value);
                    this.setState({
                        isSuggestionsVisible: false
                    });
                    this.input.value = value;
                }}>{value}</li>);
            } else {
                return null;
            }
        });
        return (
            <div styleName={"dropdown-container " + (this.state.isInputActive ? 'active': '')}>
                <input type="text"
                       ref={(input) => {
                           this.input = input;
                       }}
                       disabled={!(this.props.options && this.props.options.length)}
                       onKeyUp={this._onKeyUp}
                       onFocus={this._onFocus}
                       onBlur={this._onBlur}
                       placeholder={this.props.placeHolder}/>
                <i className="icon icon-down-arrow"></i>
                <div styleName={"suggestions " + (this.state.isSuggestionsVisible ? 'visible': '')}>
                    <ul>{optionsContent}</ul>
                </div>
            </div>
        )
    }
}
