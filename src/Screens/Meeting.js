import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import Card from '../Components/Card';
import DatePicker from 'react-date-picker';
import { MDBIcon } from 'mdbreact'
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
        msg: "",
        startType: "text",
        endType: "text",
        disabledEnd: true,
        disabled: true,
        showErr: false,
        errMsg: ""
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

        const { description, start_time, end_time } = this.state;
        let disabled = true;
        let disabledEnd = true;
        let name = e.target.name;
        // if (name === "end_time") {
        //     if (start_time === "") {
        //         alert("Select Starting Time First")
        //     }
        //     else
        //        return
        // }
        if (description !== "" && start_time !== "" && end_time !== "")
            disabled = false
        this.setState({ [e.target.name]: e.target.value, showMsg: false, showErr: false, disabled }) //setting state for input change
    }

    handleClear = () => {   //function to reset fields to default
        this.setState({ start_time: "", end_time: "", description: "" })
    }

    handleFocus = (type) => {
        let disabledEnd = true;
        if (type === "endType") {
            if (this.state.start_time !== "") {
                disabledEnd = false
            }
            else this.setState({ showErr: true, errMsg: "select start time first" })
        }
        this.setState({ [type]: "time", disabledEnd })
        console.log("type:", type)
    }
    handleSave = () => {

        const { slots, start_time, end_time, description, date } = this.state;
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
            const meeting = {
                start_time,
                end_time,
                description
            }
            console.log("meeting-->", meeting)
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
        const { date, disabled, disabledEnd, startType, endType, msg, showMsg, start_time, end_time, description, today, color, showErr, errMsg } = this.state;
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
                                onChange={(date) => { console.log("datefotChange:", date); this.setState({ date, showMsg: false, showErr: false }, () => this.fetchMeetings()) }
                                }
                                calendarIcon={<MDBIcon icon="chevron-down" />}
                                value={date}
                                minDate={today}
                                className="form-controls"

                            />
                        </div>


                    </div>
                    <div className="row my-3 ">
                        <div className="col-md-6">

                            <input type={startType} onFocus={this.handleFocus.bind(this, "startType")} value={start_time} name="start_time" placeholder="Start Time" className="form-control" onChange={this.handleChange} />
                        </div>
                        {/* <div className="col-md-1 mx-auto">

                        </div> */}
                        <div className="col-md-6">

                            <input type={endType} onFocus={this.handleFocus.bind(this, "endType")} value={end_time} readOnly={disabledEnd} name="end_time" placeholder="End Time" onChange={this.handleChange} className="form-control" />
                            {showErr && <span className="text-danger">{errMsg}</span>}
                        </div>
                    </div>

                    <div className="form-group">

                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            value={description} name="description"
                            placeholder="Description"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="text-center">
                        {showMsg && <div className={`btn text-center btn-${color}`}>{msg}</div>}

                    </div>


                </Card>
                <div className="text-center mt-5" >
                    <button className="btn btn-primary px-5 py-1" disabled={disabled} onClick={this.handleSave}>Save</button>
                </div>


            </div>
        )
    }
}

export default withRouter(Meeting)