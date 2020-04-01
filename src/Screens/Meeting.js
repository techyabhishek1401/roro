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
                    slots.push(`${meeting.start_time}-${meeting.end_time}`);  //creating slots with meeting start and end Time
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

    handleSave = () => {  //function to check if slots is available for meeting or not
        const { slots, start_time, end_time, } = this.state;
        let counter = 0, counter3 = 0;
        console.log("cjcj")
        for (var i = 0; i < slots.length; i++) {  //iterating slots array for each slot
            let item = slots[i];     //initializing item with the iterated slot
            let start, end;

            if (item.split('-')[0].split(":")[0] < 10) {
                //checking if slots's start_time is 2digit number or not  if not then adding precedding zero to it
                start = "0" + item.split("-")[0].split(":")[0] + ":" + item.split("-")[0].split(":")[1];
            }
            else start = item.split("-")[0];
            // if (item.split('-')[1].split(":")[1] < 10) {
            //     //checking if slots's end_time is 2digit number or not  if not then adding precedding zero to it
            //     end = "0" + item.split("-")[1].split(":")[1] + ":" + item.split("-")[1].split(":")[1];
            // }
            end = item.split("-")[1];
            //  let end = item.split("-")[1];
            // console.log("********************");
            // console.log("start,end:", start, end);
            // console.log("start_time,end_time:", start_time, end_time);

            if ((start_time >= start && start_time <= end && end_time >= start && end_time <= end)) {
                // checking if selecetd slot is in the iterated slot's range or not
                counter3++;
                console.log("iteration & count3-->", i, counter3)
                //  return true;
            }
            else {
                // console.log("iteration & count3-->", i, counter3)
                counter++;
                console.log("iteration & count-->", i, counter)
                //  return false;
            }

        }
        console.log("final counter,counter3:", counter, counter3)

        if (counter3 <= 0) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
        }
        else
            this.setState({ msg: "SLOT Not AVAILABLE", showMsg: true, color: "danger" })
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