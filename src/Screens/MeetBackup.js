import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import Card from '../Components/Card';
import DatePicker from 'react-date-picker';
import { MDBIcon } from 'mdbreact';
import Header from '../Components/Header';
import MeetingItem from '../Components/Meeting-Item';
import history from '../history';
import Loader from '../Components/Loader';
class Meeting extends Component {
    state = {
        date: new Date().toISOString().split("T")[0],
        today: new Date(),
        loading: true,
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
        errMsg: "",
        startTimeMin: new Date().getTime(),
        endTimeMin: new Date().getTime() + 1,
        showMeeting: false
    }

    fetchMeetings = () => {
        let today = this.state.date;
        console.log("######FETCH MEETING TRIGGERED######")
        // get request to get all the meetings for the selected date
        Axios.get(`/api/schedule?date=${today}`)
            .then(result => {
                console.log("sss:", result.data)
                let slots = [];
                result.data.map(meeting => {
                    slots.push({ st_Time: meeting.start_time, end_time: meeting.end_time });  //creating slots with meeting start and end Time
                })
                localStorage.setItem('meetings', JSON.stringify(result.data))
                this.setState({ meetings: result.data, slots, loading: false })  //setting meetings array and slots
            }).catch(err => {
                this.setState({ loading: false })
                throw err;
            })
    }

    handleChange = (e) => {

        const { description, start_time, end_time, date, today } = this.state;
        let disabled = true;
        let name = e.target.name;
        let now = new Date();



        if (description !== "" && start_time !== "" && end_time !== "" && Date.parse(`2011-10-09T${start_time}`) < Date.parse(`2011-10-09T${end_time}`))
            disabled = false;


        if (name === "description" && start_time !== "" && end_time !== "" && Date.parse(`2011-10-09T${start_time}`) < Date.parse(`2011-10-09T${end_time}`))
            disabled = false;
        if (name === "end_time" && description !== "") {
            //  debugger;
            if (Date.parse(`2011-10-09T${start_time}`) >= Date.parse(`2011-10-09T${e.target.value}`))
                disabled = true
        }
        if ((name === "start_time" && end_time === e.target.value) || (name === "end_time" && start_time === e.target.value)) {
            disabled = true
        }
        // if(date.getTime()<new Date().get)
        // console.log("date,today,now", date.getTime(), today.getTime(), now.getTime())
        if (true) {

            let todayD = today;
            let nowD = now;
            let dateD = date;
            // let my_start = parseInt(start_time.replace(regex, ''), 10);
            // let my_end = parseInt(end_time.replace(regex, ''), 10);
            let t = nowD.toISOString().split("T")[0]
            let my_start = Date.parse(`${t}T${start_time}`);
            let my_end = Date.parse(`${t}T${end_time}`);

            if (dateD.toISOString().split("T")[0] === todayD.toISOString().split("T")[0]) {
                console.log("my_start,my_end,now", my_start, my_end, nowD.getTime());
                if (my_start < nowD.getTime())
                    disabled = true;
            }
            // console.log("date,today,now", todayD, nowD, dateD)
        }
        if (name === "end_time" || name === "start_time") {
            debugger;
            let time = parseInt(e.target.value.split(":").join(""))
            console.log("Dhdddsc nsc ndc shc sh:", parseInt(e.target.value.split(":").join("")))
            if (time < 900 || time > 2100)
                disabled = true;
        }
        if (e.target.value === "")
            disabled = true
        this.setState({ [e.target.name]: e.target.value, showMsg: false, showErr: false, disabled }) //setting state for input change
    }

    handleClear = () => {   //function to reset fields to default
        this.setState({ start_time: "", end_time: "", description: "", startType: "text", endType: "text" })
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

    }



    handleSave = () => {
        const { start_time, end_time, slots, description, date, meetings } = this.state;
        var regex = new RegExp(':', 'g');
        var startTime = start_time;
        var endTime = end_time;
        var isTime = true;


        for (let i = 0; i < slots.length; i++) {
            let arr_start = parseInt(slots[i].st_Time.replace(regex, ''), 10);
            let arr_end = parseInt(slots[i].end_time.replace(regex, ''), 10);
            let my_start = parseInt(startTime.replace(regex, ''), 10);
            let my_end = parseInt(endTime.replace(regex, ''), 10);

            // console.log('aStart:', arr_start, arr_end);
            // console.log('mStart:', my_start, my_end);

            if ((my_start <= arr_end && my_start >= arr_start) || (my_end >= arr_start && my_end <= arr_end)) {
                if (my_start === arr_end || my_end === arr_start) {
                    continue;
                }
                isTime = false;

                break;
            }
        }
        if (isTime) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" });
            const previosMeetings = JSON.parse(localStorage.getItem('meetings'));
            const meeting = {
                start_time,
                end_time,
                description,
                participants: []
            }
            //   console.log("meetin previos-->", previosMeetings);
            previosMeetings.push(meeting)
            //   console.log("meeting new-->", previosMeetings);
            // this.setState({ meetings: previosMeetings, showMeeting: true })
            localStorage.setItem("meetings", JSON.stringify(previosMeetings));
            localStorage.setItem("date", date)
            history.push({
                pathname: "/",
                state: { meetings, date }
            })

        }
        else
            this.setState({ msg: "SLOT Not AVAILABLE", showMsg: true, color: "danger" })

        console.log("isTime:", isTime)
    }


    componentDidMount() {
        let today = new Date();
        let dateLocal = new Date(localStorage.getItem('date'));
        let dateProp = new Date(this.props.location.state.date);
        let meetings = localStorage.getItem('meetings');

        if (dateLocal && meetings && dateLocal.toISOString().split("T")[0] === dateProp.toISOString().split("T")[0]) {

            console.log("meetings,date:-->", meetings, dateLocal)
            let slots = [];
            JSON.parse(meetings).map(meeting => {
                slots.push({ st_Time: meeting.start_time, end_time: meeting.end_time });  //creating slots with meeting start and end Time
            })
            this.setState({ meetings: JSON.parse(meetings), slots, date: dateLocal, loading: false })
        }
        else   //this.fetchMeetings()
            this.setState({ date: new Date(this.props.location.state.date), loading: false }, () => {
                this.fetchMeetings()
            })

    }



    render() {
        const { date, disabled, loading, disabledEnd, startType, endType, msg, showMsg, start_time, end_time, description, today, color, showErr, errMsg } = this.state;
        // console.log("slots:", this.state.slots);
        return (
            <div>
                <Header items={["Home", "Add Meeting"]} />
                {loading ? <Loader show={loading} /> : <div>
                    <Card>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="startTime">
                                    Meeting Date
                           </label>
                                <DatePicker
                                    onChange={(date) => { this.setState({ date, showMsg: false, showErr: false, loading: true }, () => { this.handleClear(); this.fetchMeetings() }) }
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
                                {/* <TimePicker
                                onChange={this.dateChange}
                                value={start_time}
                                name="start_time"
                                minTime={0}
                            /> */}
                                <input type={startType} onFocus={this.handleFocus.bind(this, "startType")} min={"09:00"} value={start_time} name="start_time" placeholder="Start Time" className="form-control" onChange={this.handleChange} />
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
                }



            </div>
        )
    }
}

export default withRouter(Meeting)