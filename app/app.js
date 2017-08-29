import React from 'react';
import './assets/styles/main.scss';
import EmployeeSelectModal from "./components/employee-select-modal/employeeSelectModal";

// environment is coming from webpack define plugin
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
        this._showModal = this.showModal.bind(this);
        this._closeModal = this.closeModal.bind(this);
    }
    showModal() {
        this.setState({
            isModalOpen: true,
            selectedTeamMember: null,
            selectedTeam: null
        });
    }
    render() {
        return (
            <div className="app-wrapper">
                <div className="button-wrapper">
                    <button className="btn" onClick={this._showModal}>Select Employee & Team</button>
                    <br/><br/>
                    {this.state.selectedTeam} - {this.state.selectedTeamMember}
                </div>
                <div>

                </div>
                { this.state.isModalOpen && (<EmployeeSelectModal closeModal={this._closeModal}/>)}
            </div>
        );
    }
    closeModal(selectedData) {
        if(selectedData) {
            this.setState({
                selectedTeam: selectedData.selectedTeam,
                selectedTeamMember: selectedData.selectedTeamMember,
            });
        }
        this.setState({
            isModalOpen: false
        });
    }
}
