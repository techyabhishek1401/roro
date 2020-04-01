import React, { Component } from 'react';
import Card from '../Components/Card';
import MeetingItem from '../Components/Meeting-Item';
import { MDBIcon } from 'mdbreact'
import Axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import history from '../history';
import Header from '../Components/Header'

class Home extends Component {
    state = {
        date: new Date(),
        loading: true,
        disabled: false,
        meetings: [{
            "start_time": "10:00",
            "end_time": "11:00",
            "description": "Interview of Rails developer",
            "participants": [
                "Sumit Arora",
                "Neha",
                "Daivanshu"
            ]
        }]
    }



    handleDateChange = (type) => {
        //  debugger;
        let i = type === "prev" ? -1 : 1;
        let disabled = false;
        let tomorrow = this.state.date;
        console.log("today:", tomorrow)
        let date = new Date(tomorrow.setDate(tomorrow.getDate() + 1 * i));
        let now = new Date();
        console.log("fetchdate:", date, now)



        if (date.getTime() < now.getTime())
            disabled = true;
        else if (date.getTime() === now.getTime())
            disabled = false;

        this.setState({ date, disabled }, (err) => {
            if (err) {
                console.log("err:", err)
            }
            this.fetchMeetings()
        })
    }



    handleAdd = (e) => {
        history.push({
            pathname: "meeting",
            state: { date: this.state.date }
        })

    }

    fetchMeetings = () => {


        let now = this.state.date;
        Axios.get(`/api/schedule?date=${now.toLocaleDateString('en-GB')}`)
            .then(result => {

                console.log("sss:", result.data)
                this.setState({ meetings: result.data, })
            }).catch(err => {
                throw err;
            })
    }
    componentDidMount() {

        this.fetchMeetings()
    }
    render() {
        console.log("date inside home:", this.state.date)
        const { date, meetings, loading, disabled } = this.state;
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <>
                <Header items={["Home", "Meetings"]} />
                <div className="container text-center " >
                    <div className="date-header  text-center text-info mb-5">

                        <MDBIcon icon="chevron-left" className="navigation-icon fa-2x" onClick={this.handleDateChange.bind(this, "prev")} />
                        <span className="date">{date.toString().split(" ")[2]} {date.toString().split(" ")[1]} {date.toString().split(" ")[3]}</span>
                        <MDBIcon icon="chevron-right" className="navigation-icon fa-2x" onClick={this.handleDateChange.bind(this, "next")} />
                    </div>
                    <div>
                        {
                            meetings.map((meeting, index) => {
                                return <MeetingItem meeting={meeting} uniqueKey={index} key={index} />
                            })
                        }
                    </div>

                    <button onClick={this.handleAdd} className="px-5 mt-5 py-1 btn btn-primary add-btn" disabled={disabled}>Add Meeting</button>
                </div>
            </>

        )
    }
}
export default withRouter(Home)