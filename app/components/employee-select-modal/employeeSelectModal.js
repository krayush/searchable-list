import React from 'react';
import SearchableDropdown from '../searchable-dropdown/searchableDropdown';
import './_employee-select-modal.scss';
import { dataService } from '../../services/dataService';
import Loader from "../loader/loader";
export default class EmployeeSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.userInfoMap = {};
        this.state = {
            isFetching: false,
            userData: null,
            selectedTeam: null,
            selectedTeamMember: null,
            teamsList: null
        }
        this._onSelectTeam = this.onSelectTeam.bind(this);
        this._onSelectTeamMember = this.onSelectTeamMember.bind(this);
        this._closeModal = this.closeModal.bind(this);
        this._submitModal = this.submitModal.bind(this);
    }
    componentWillMount() {
        this.fetchData();
    }
    processUserList(response) {
        this.userInfoMap = {};
        var teamsList = [];
        if(response && response.length) {
            response.map((value) => {
                this.userInfoMap[value.team] = value.employees;
                teamsList.push(value.team);
            });
        }
        this.setState({
            userData: response,
            teamsList: teamsList
        });
    }
    fetchData() {
        this.setState({
            isFetching: true
        });
        dataService.get("fetchUserData", {}, {}).then((response) => {
            this.processUserList(response.data);
        }).catch((e) => {
            console.error(e);
            this.setState({
                userData: []
            });
        }).then(() => {
            this.setState({
                isFetching: false
            });
        });
    }
    render() {
        return (
            <div styleName="user-info-wrapper">
                <div styleName="overlay"></div>
                <div styleName="user-info-container">
                    <i className="icon icon-close"
                       onClick={this._closeModal}
                       styleName="close-icon"></i>
                    {this.state.isFetching && (<Loader overlay={true} classList="small"/>)}
                    <div styleName="info-header">Select an Employee</div>
                    <div styleName="welcome-text">
                        <input type="checkbox" />
                        <span>Send welcome email to employee</span>
                    </div>
                    <div styleName="select-section">
                        <div styleName="title">Select a Team in the Organization</div>
                        <SearchableDropdown options={this.state.teamsList}
                                            onSelect={this._onSelectTeam}
                                            random={this.state.clickRandom}
                                            placeHolder="Select Team..."/>
                    </div>
                    <div styleName="select-section">
                        <div styleName="title">Select an Employee</div>
                        <SearchableDropdown options={this.userInfoMap[this.state.selectedTeam]}
                                            onSelect={this._onSelectTeamMember}
                                            random={this.state.clickRandom}
                                            placeHolder="Select Employee..."/>
                    </div>
                    <div styleName="warning-text">{this.state.warningText}</div>
                    <div styleName="button-section">
                        <button className="btn-blue" onClick={this._submitModal}>OK</button>
                        <button className="btn-blue" onClick={this._closeModal}>Cancel</button>
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        )
    }
    onSelectTeam(value) {
        this.setState({
            selectedTeam: value,
            warningText: null,
            selectedTeamMember: null
        });
    }
    onSelectTeamMember(value) {
        var teamMemberList = this.userInfoMap[this.state.selectedTeam];
        if(teamMemberList.indexOf(value) > -1) {
            this.setState({
                selectedTeamMember: value
            });
        } else {
            this.setState({
                selectedTeamMember: null
            });
        }
        this.setState({
            warningText: null
        });
    }
    closeModal() {
        var selectedTeamMember = this.state.selectedTeamMember;
        var selectedTeam = this.state.selectedTeam;
        if(selectedTeam || selectedTeamMember) {
            var confirm = window.confirm("You have pending edits. Are you sure you want to close?");
            if(confirm) {
                this.props.closeModal();
            }
        } else {
            this.props.closeModal();
        }
    }
    submitModal(e) {
        if(this.state.selectedTeamMember) {
            this.setState({
                warningText: null
            });
            this.props.closeModal({
                selectedTeam: this.state.selectedTeam,
                selectedTeamMember: this.state.selectedTeamMember
            });
        } else {
            this.setState({
                warningText: "Please select appropriate team and team member"
            });
        }
        e.stopPropagation();
    }
}
