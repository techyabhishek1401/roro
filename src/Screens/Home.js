import React, { Component } from 'react';
import Card from '../Components/Card';
import MeetingItem from '../Components/Meeting-Item';
import { MDBIcon } from 'mdbreact'
import Axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import history from '../history';
import Header from '../Components/Header';
import Loader from '../Components/Loader';

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.start_time.toUpperCase();
    const bandB = b.start_time.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}

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
        //  console.log("today:", tomorrow)
        let date = new Date(tomorrow.setDate(tomorrow.getDate() + 1 * i));
        let now = new Date();
        console.log("fetchdate:", date.getDate(), now.getDate())


        if (date.getDate() < now.getDate())
            disabled = true;
        else if (date.getTime() === now.getTime())
            disabled = false;

        this.setState({ date, disabled, loading: true }, (err) => {
            if (err) {
                console.log("err:", err)
            }
            this.fetchMeetings()
        })
    }



    handleAdd = (e) => {
        localStorage.setItem("date", this.state.date);
        localStorage.setItem("meetings", JSON.stringify(this.state.meetings))
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
                localStorage.setItem('meetings', JSON.stringify(result.data));
                localStorage.setItem('date', now);
                this.setState({ meetings: result.data.sort(compare), loading: false })
            }).catch(err => {
                throw err;
            })
    }
    componentDidMount() {

        // let today = new Date();
        // let dateLocal = new Date(localStorage.getItem('date'));
        // let meetings = localStorage.getItem('meetings');
        // // setting meeting date to selected date from list
        // if (dateLocal && meetings && dateLocal.toISOString().split("T")[0] === today.toISOString().split("T")[0]) {

        //     console.log("meetings,date:-->", meetings, dateLocal)
        //     this.setState({ meetings: JSON.parse(meetings), date: dateLocal, loading: false })
        // }
        // 8888888888888
        if (localStorage.getItem('meetings') && localStorage.getItem('date')) {
            //   const { meetings, date } = this.props.location.state;
            let meetings = JSON.parse(localStorage.getItem('meetings')).sort(compare);
            let date = new Date(localStorage.getItem('date'));
            console.log("meetings,date:-->", meetings, date)
            this.setState({ meetings, date, loading: false })
        }
        else this.fetchMeetings()
    }
    render() {
        // console.log("date inside home:", this.state.date)
        const { date, meetings, loading, disabled } = this.state;
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <>
                <Header items={["Home", "Meetings"]} />
                {loading ? <Loader show={loading} /> : <div className="container text-center " >
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
                </div>}
            </>

        )
    }
}
export default withRouter(Home)