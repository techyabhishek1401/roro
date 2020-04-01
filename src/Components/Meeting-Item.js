import React from 'react'

const convertTime = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        console.log("time:", time);
        time = time.slice(1);  // Remove full string match value
        console.log("timeSliced:", time);
        time[5] = +time[0] < 12 ? ' AM ' : ' PM '; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    console.log("time returnded-->", time.join(' '))
    return time.join(''); // return adjusted time or original string

}
export default function MeetingItem({ meeting, uniqueKey }) {

    return (
        <div className="meeting-card  row my-2 px-2 py-1" key={`meeting-${uniqueKey}`}>
            <div className="col-4"><p className="time-slot">{convertTime(meeting.start_time)}-{convertTime(meeting.end_time)}</p></div>
            <div className="col-3"></div>
            <div className="col-5 text-left">  <p style={{ fontSize: "14px" }}>   Meeting with {meeting.participants.map((participant, index) => {
                return <span key={`participant-${uniqueKey}${index}`}>{participant},</span>
            })} For {meeting.description}</p></div>


        </div>
    )
}
