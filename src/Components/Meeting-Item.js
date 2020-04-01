import React from 'react'

export default function MeetingItem({ meeting, uniqueKey }) {
    console.log("******Key:", uniqueKey)
    return (
        <div className="meeting-card  row my-2 px-2 py-1" key={`meeting-${uniqueKey}`}>
            <div className="col-4"><p>{meeting.start_time}-{meeting.end_time}</p></div>
            <div className="col-8 text-left">  <p>   Meeting with {meeting.participants.map((participant, index) => {
                return <span key={`participant-${uniqueKey}${index}`}>{participant},</span>
            })} For {meeting.description}</p></div>


        </div>
    )
}
