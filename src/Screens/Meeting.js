import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import Card from '../Components/Card';
import DatePicker from 'react-date-picker';
import Header from '../Components/Header'
class Meeting extends Component {
    state = {
        date: new Date().toISOString().split("T")[0],
        today: new Date(),
        description: "",
        meetings: [],
        slots: [],
        startSlots: [],
        endSlots: [],
        start_time: "",
        end_time: "",
        showMsg: false,
        msg: ""
    }

    fetchMeetings = () => {
        let today = this.state.date;
        // get request to get all the meetings for the selected date
        Axios.get(`/api/schedule?date=${today}`)
            .then(result => {
                console.log("sss:", result.data)
                let slots = [], m = [], n = [];
                result.data.map(meeting => {
                    slots.push({ st_Time: meeting.start_time, end_time: meeting.end_time });  //creating slots with meeting start and end Time
                })
                this.setState({ meetings: result.data, slots })  //setting meetings array and slots
            }).catch(err => {
                throw err;
            })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, showMsg: false }) //setting state for input change
    }

    handleClear = () => {   //function to reset fields to default
        this.setState({ start_time: "", end_time: "", description: "" })
    }

    handleSave = () => {

        const { slots, start_time, end_time, } = this.state;
        var regex = new RegExp(':', 'g');
        var startTime = start_time;
        var endTime = end_time;
        var isTime = true;

        for (let i = 0; i < slots.length; i++) {
            if (parseInt(startTime.replace(regex, ''), 10) >= parseInt(slots[i].st_Time.replace(regex, ''), 10) && parseInt(startTime.replace(regex, ''), 10) <= parseInt(slots[i].end_time.replace(regex, ''), 10) ||
                parseInt(endTime.replace(regex, ''), 10) >= parseInt(slots[i].st_Time.replace(regex, ''), 10) && parseInt(endTime.replace(regex, ''), 10) <= parseInt(slots[i].end_time.replace(regex, ''), 10)

            ) {
                isTime = false;
                break;
            }


        }
        if (isTime) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
        }
        else
            this.setState({ msg: "SLOT Not AVAILABLE", showMsg: true, color: "danger" })
        console.log(isTime)
    }


    componentDidMount() {
        // setting meeting date to selected date from list
        this.setState({ date: new Date(this.props.location.state.date) }, () => {
            this.fetchMeetings()
        })

    }

    render() {
        const { date, meetings, slots, msg, showMsg, start_time, end_time, description, today, color } = this.state;
        console.log("slots:", this.state.slots);
        return (
            <div>
                <Header items={["Home", "Add Meeting"]} />
                <div>

                </div>
                <Card>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="startTime">
                                Meeting Date
                       </label>
                            <DatePicker
                                onChange={(date) => { console.log("datefotChange:", date); this.setState({ date, showMsg: false }, () => this.fetchMeetings()) }
                                }
                                value={date}
                                minDate={today}
                                className="form-control"

                            />
                        </div>


                    </div>
                    <div className="row my-3">
                        <div className="col-md-6">
                            <label htmlFor="startTime">
                                Start Time
                       </label>
                            <input type="time" value={start_time} name="start_time" className="form-control" onChange={this.handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="endTime">
                                End Time
                       </label>
                            <input type="time" value={end_time} name="end_time" onChange={this.handleChange} className="form-control" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">
                            Description
                       </label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            value={description} name="description" onChange={this.handleChange}
                        />
                    </div>
                    <div className="text-center">
                        {showMsg && <div className={`btn text-center btn-${color}`}>{msg}</div>}

                    </div>
                    <div className="text-center">


                        <button className="btn btn-primary px-5 py-1" onClick={this.handleSave}>Save</button>
                    </div>

                </Card>


            </div>
        )
    }
}

export default withRouter(Meeting)