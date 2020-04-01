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
                localStorage.setItem('meetings', JSON.stringify(result.data))
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
        if (description !== "" && start_time !== "" && end_time !== "" && Date.parse(`2011-10-09T${start_time}`) < Date.parse(`2011-10-09T${end_time}`))
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
        const { start_time, end_time, slots, description, date } = this.state;
        var regex = new RegExp(':', 'g');
        var startTime = start_time;
        var endTime = end_time;
        var isTime = true;
        // let slots = [{ st_Time: "10:00", end_time: "11:00" }
        //     , { st_Time: "14:00", end_time: "14:30" }
        //     , { st_Time: "9:30", end_time: "11:00" }
        //     , { st_Time: "15:30", end_time: "16:00" }
        // ]

        for (let i = 0; i < slots.length; i++) {
            // let arr_start = parseInt(slots[i].st_Time.replace(regex, ''), 10);
            // let arr_end = parseInt(slots[i].end_time.replace(regex, ''), 10);
            // let my_start = parseInt(startTime.replace(regex, ''), 10);
            // let my_end = parseInt(endTime.replace(regex, ''), 10);
            let arr_start = Date.parse(`2011-10-09T${slots[i].st_Time}`);
            let arr_end = Date.parse(`2011-10-09T${slots[i].end_time}`);
            let my_start = Date.parse(`2011-10-09T${startTime}`)
            let my_end = Date.parse(`2011-10-09T${endTime}`)
            //   (start_time >= start && start_time <= end && end_time >= start && end_time <= end)
            //   if (my_start >= arr_start && my_start <= arr_end && my_end >= arr_start && my_end <= arr_end) {
            if (
                //(arr_start >= my_start && arr_start <= my_end && arr_end >= my_start && arr_end <= my_end)
                // || (my_start >= arr_start && my_start <= arr_end && my_end >= arr_start && my_end <= arr_end)
                //||
                ((my_start <= arr_start && my_end >= arr_start) || (my_start <= arr_end && my_end >= arr_end) || (my_start >= arr_start && my_end <= arr_end))
                //|| ((arr_start <= my_start && arr_start >= my_end) || (arr_end <= my_start && arr_end >= my_end) || (arr_start >= my_start && arr_end <= my_end))
            )
            // if ((my_start <= arr_start && my_end >= arr_start) || (my_start <= arr_end && my_end >= arr_end) || (my_start >= arr_start && my_end <= arr_end)) {

            {
                isTime = false;
                console.log("i:", i);
                break;
            }

        }
        if (isTime) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" });
            const previosMeetings = JSON.parse(localStorage.getItem('meetings'));
            const meeting = {
                start_time,
                end_time,
                description
            }
            console.log("meetin previos-->", previosMeetings);
            previosMeetings.push(meeting)
            console.log("meeting new-->", previosMeetings);

            localStorage.setItem("meetings", JSON.stringify(previosMeetings))
        }
        else
            this.setState({ msg: "SLOT Not AVAILABLE", showMsg: true, color: "danger" })

        console.log("isTime:", isTime)
    }
    handleSavew = () => {

        const { slots, start_time, end_time, description, date } = this.state;
        var regex = new RegExp(':', 'g');
        var startTime = start_time;
        var endTime = end_time;
        var isTime = true;
        debugger;
        // for (let i = 0; i < slots.length; i++) {
        //     console.log("startTime:", parseInt(startTime.replace(regex, ''), 10));
        //     console.log("endTime:", parseInt(endTime.replace(regex, ''), 10));
        //     console.log("st_Time:", parseInt(slots[i].st_Time.replace(regex, ''), 10));
        //     console.log("end_time:", parseInt(slots[i].end_time.replace(regex, ''), 10));
        //     if (parseInt(startTime.replace(regex, ''), 10) > parseInt(slots[i].st_Time.replace(regex, ''), 10) && parseInt(startTime.replace(regex, ''), 10) < parseInt(slots[i].end_time.replace(regex, ''), 10) ||
        //         parseInt(endTime.replace(regex, ''), 10) > parseInt(slots[i].st_Time.replace(regex, ''), 10) && parseInt(endTime.replace(regex, ''), 10) < parseInt(slots[i].end_time.replace(regex, ''), 10)

        //     ) {
        //         isTime = false;
        //         break;
        //     }
        // }

        if (isTime) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" });
            const previosMeetings = JSON.parse(localStorage.getItem('meetings'));
            const meeting = {
                start_time,
                end_time,
                description
            }
            console.log("meetin previos-->", previosMeetings);
            previosMeetings.push(meeting)
            console.log("meeting new-->", previosMeetings);

            localStorage.setItem("meetings", JSON.stringify(previosMeetings))
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
        // console.log("slots:", this.state.slots);
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
                <div className="text-center" >
                    <button className="btn btn-primary px-5 py-1" disabled={disabled} onClick={this.handleSave}>Save</button>
                </div>


            </div>
        )
    }
}

export default withRouter(Meeting)