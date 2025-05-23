// src/Schedule.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Timeline from './Timeline.jsx'

export default function Schedule({ userName, events, setEvents }) {
    const daysOfCon = ['Thursday','Friday','Saturday','Sunday']
    const [selectedDay, setSelectedDay] = useState(daysOfCon[0])

    // all people ever added
    const persons = Array.from(new Set(events.map(ev => ev.person)))
    // only this day’s events
    const eventsForDay = events.filter(ev => ev.day === selectedDay)

    // remove one event (only your own)
    const handleRemove = evToRemove => {
        if (evToRemove.person !== userName) return
        setEvents(prev => prev.filter(ev => ev !== evToRemove))
    }

    // join someone else's event by cloning it under your name
    const handleJoin = evToJoin => {
        setEvents(prev => [
            ...prev,
            { ...evToJoin, person: userName }
        ])
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>My Daily Schedule</h1>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {daysOfCon.map(day => {
                    const isActive = day === selectedDay
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            style={{
                                padding: '8px 16px',
                                background:   isActive ? '#333' : '#eee',
                                color:        isActive ? 'white' : 'black',
                                border:       'none',
                                borderRadius: 4,
                                cursor:       'pointer',
                                fontWeight:   isActive ? 'bold' : 'normal',
                            }}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            <Timeline
                persons={persons}
                events={eventsForDay}
                userName={userName}
                removeEvent={handleRemove}
                joinEvent={handleJoin}
            />

            <Link to="/">
                <button style={{ marginTop: 20 }}>Back to Home</button>
            </Link>
        </div>
    )
}
