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
        Axios.get(`/api/schedule?date=${today}`)
            .then(result => {
                console.log("sss:", result.data)
                let t = [], m = [], n = [];
                result.data.map(meeting => {
                    t.push(`${meeting.start_time}-${meeting.end_time}`);
                    m.push(meeting.start_time);
                    n.push(meeting.end_time);
                })
                this.setState({ meetings: result.data, loading: false, slots: t, startSlots: m, endSlots: n }, () => console.log("satte:", this.state))
            }).catch(err => {
                throw err;
            })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, showMsg: false })
    }

    handleSave = () => {
        const { date, meetings, slots, start_time, startSlots, endSlots, end_time, description } = this.state;
        let counter = 0, counter2 = 0, counter3 = 0;
        console.log("cjcj")
        for (var i = 0; i < slots.length; i++) {
            let item = slots[i];
            let start;
            // console.log("starttt:", item.split('-')[0].split(":")[0])
            if (item.split('-')[0].split(":")[0] < 10) {
                start = "0" + item.split("-")[0].split(":")[0] + ":" + item.split("-")[0].split(":")[1];

            }
            else start = item.split("-")[0];
            let end = item.split("-")[1];
            console.log("********************");
            console.log("start,end:", start, end);
            console.log("start_time,end_time:", start_time, end_time);
            // if (start_time <= start && end_time <= end) {
            //     counter++;
            //     console.log("iteration & count-->", i, counter)
            // }
            // else if (start_time > start && end_time >= end) {
            //     counter2++;
            //     console.log("iteration & count2-->", i, counter2)
            // }
            // else {
            //     counter3++;
            //     console.log("iteration & count3-->", i, counter3)
            // }
            if ((start_time >= start && start_time <= end && end_time >= start && end_time <= end))
            // ||
            // (x >= 70 && x <= 100 && y >= 70 && y <= 100))
            {
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

        // if (counter > 0 && counter2 > 0 && counter3 <= 0) {
        //     this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
        // }
        if (counter3 <= 0) {
            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
        }
        else
            this.setState({ msg: "SLOT Not AVAILABLE", showMsg: true, color: "danger" })
    }

    handleSaves = () => {
        // this.checkAvai();
        const { date, meetings, slots, start_time, startSlots, endSlots, end_time, description } = this.state;
        let k = [];
        //  console.log("submit state:", this.state)

        let check = (time, index) => {
            //    console.log("tssine--<", time, index)
            var formattedNumber = ("0" + time.split(":")[0]).slice(-2);
            //   console.log("formated:", formattedNumber)
            return formattedNumber === start_time.split(":")[0]
        }
        let m = startSlots.some(check);
        if (m) {
            // k = slots.filter(item => {
            //     console.log("filtered:", item)
            //     item.split["-"]
            // })
            for (var i = 0; i < slots.length; i++) {
                let item = slots[i];
                let start;
                // console.log("starttt:", item.split('-')[0].split(":")[0])
                if (item.split('-')[0].split(":")[0] < 10) {

                    start = "0" + item.split("-")[0].split(":")[0] + ":" + item.split("-")[0].split(":")[1];

                }
                else start = item.split("-")[0];
                let end = item.split("-")[1];
                console.log("********************");
                console.log("start,end:", start, end);
                console.log("start_time,end_time:", start_time, end_time);
                if (start_time <= start) {
                    if (start_time <= start && end_time <= start) {
                        console.log("----->avail2<---");
                        this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
                        break;
                    }
                    else if (start_time <= start && end_time <= end) {
                        console.log("----->not avail2<---");
                        this.setState({ msg: "SLOT NOT AVAILABLE", showMsg: true, color: "danger" })
                        break;

                    }
                    else console.log("else")
                }
                if (start_time >= start) {
                    // console.log("start_time >= start")
                    if (start_time >= start && end_time)
                        console.log("NOT AVAILABLE-1")
                    this.setState({ msg: "SLOT NOT AVAILABLE", showMsg: true, color: "danger" })
                    break;
                }
                this.setState({ msg: "SLOT  AVAILABLE", showMsg: true, color: "primary" })
                // else if (start_time >= start && end_time >= end) {

                //     console.log("AVAILABLE-1");
                //     break;
                // }
                // if (end_time <= end) {
                //     console.log("end_time <= end")
                // }
                console.log("********************");
            }

            // slots.map(item => {

            // })

            // this.setState({ msg: "SLOT NOT AVAILABLE", showMsg: true, color: "danger" })
        }
        else {

            this.setState({ msg: "SLOT AVAILABLE", showMsg: true, color: "success" })
        }
        // console.log("k:", k)

    }
    componentDidMount() {

        this.setState({ date: new Date(this.props.location.state.date) }, () => {
            this.fetchMeetings()
        })

    }

    // checkAvai = () => {
    //     const { date, meetings, slots, msg, showMsg, start_time, end_time, description, today, color } = this.state;
    //     var selectedTime = `${start_time}`;


    //     slots.map(item => {
    //         console.log("Item:", item)
    //         var startTime = item.split('-')[0];
    //         var endTime = item.split('-')[1];

    //         var startTime = Date.parse('01/01/2001 ' + startTime);
    //         var endTime = Date.parse('01/01/2001 ' + endTime);

    //         if (selectedTime <= startTime && selectedTime >= endTime) {

    //             console.log("Time in beween interval")
    //         } else {

    //             console.log("Time is not with in the time Slot")
    //         }
    //     })

    // }
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
                            <input type="time" value={start_time} name="start_time" className="form-control" onChange={this.handleChange} />
                        </div>
                        <div className="col-md-6">
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