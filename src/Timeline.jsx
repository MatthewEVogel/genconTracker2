// src/Timeline.jsx
import React, { useState } from 'react'
import './Timeline.css'

export default function Timeline({
                                     persons = [],
                                     events   = [],
                                     removeEvent,
                                     joinEvent,
                                     userName
                                 }) {
    // 1) build the times array 8:00 AM → 12:00 AM
    const times = Array.from({ length: 16 }, (_, i) => {
        const h = 8 + i
        const suffix = h < 12 ? 'AM' : 'PM'
        const hour12 = h % 12 === 0 ? 12 : h % 12
        return `${hour12}:00 ${suffix}`
    }).concat('12:00 AM')

    // 2) helper values for positioning
    const totalMins     = 16 * 60         // 960 minutes span
    const cellCount     = times.length    // 17 labels
    const fudge         = (cellCount - 1) / cellCount // 16/17

    // 3) parsing helpers
    const parseStartMins = raw => {
        let t = raw
            .replace(/^[^,]*,\s*/, '')        // strip "Thursday, "
            .replace(/\s*(EDT|EST|CDT|CST|MDT|MST|PDT|PST)$/, '')
            .trim()                           // "8:30 AM"
        const [time, mer] = t.split(' ')
        let [h, m] = time.split(':').map(Number)
        if (mer === 'PM' && h < 12) h += 12
        if (mer === 'AM' && h === 12) h = 0
        return h * 60 + m - 8 * 60
    }
    const parseDurationMins = raw => {
        let hrs = 0, mins = 0
        const hm = raw.match(/(\d+)\s*hr/)
        const mm = raw.match(/(\d+)\s*min/)
        if (hm) hrs  = +hm[1]
        if (mm) mins = +mm[1]
        return hrs * 60 + mins
    }

    // 4) track which event’s popup is open
    //    popupInfo = { ev, person, leftPct }
    const [popupInfo, setPopupInfo] = useState(null)

    // 5) your own events on this day for conflict checking
    const userEvents = events.filter(ev => ev.person === userName)
    const hasConflict = ev => {
        const start = parseStartMins(ev.start)
        const end   = start + parseDurationMins(ev.duration)
        for (const ue of userEvents) {
            const us = parseStartMins(ue.start)
            const ueEnd = us + parseDurationMins(ue.duration)
            if (start < ueEnd && end > us) return true
        }
        return false
    }

    return (
        // clicking outside any block clears the popup
        <div className="schedule-container" onClick={() => setPopupInfo(null)}>
            {/* header row */}
            <div className="schedule-row header-row">
                <div className="name-cell header-cell" />
                {times.map(t => (
                    <div key={t} className="time-cell header-cell">{t}</div>
                ))}
            </div>

            {persons.map(person => {
                // events for this person on the selected day
                const evs = events.filter(ev => ev.person === person)

                return (
                    <div className="schedule-row" key={person}>
                        <div className="name-cell">{person}</div>
                        <div className="time-wrapper">
                            {/* empty grid */}
                            {times.map((_, i) => (
                                <div key={i} className="time-cell" />
                            ))}

                            {/* event blocks */}
                            {evs.map((ev, idx) => {
                                const sMin   = parseStartMins(ev.start)
                                const dMin   = parseDurationMins(ev.duration)
                                const rawL   = (sMin / totalMins) * 100
                                const rawW   = (dMin / totalMins) * 100
                                const left   = rawL * fudge
                                const width  = rawW * fudge
                                const isMine = ev.person === userName

                                return (
                                    <div
                                        key={idx}
                                        className="event-block"
                                        style={{
                                            left:   `${left}%`,
                                            width:  `${width}%`,
                                            cursor: 'pointer'
                                        }}
                                        // stop a click from bubbling up
                                        onClick={e => {
                                            e.stopPropagation()
                                            setPopupInfo({ ev, person, leftPct: left })
                                        }}
                                    >
                                        {ev.title}
                                    </div>
                                )
                            })}

                            {/* popup: only in the matching row */}
                            {popupInfo && popupInfo.person === person && (
                                <div
                                    className="event-popup"
                                    style={{ left: `${popupInfo.leftPct}%` }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {popupInfo.ev.person === userName ? (
                                        // your own event: Cancel
                                        <button
                                            onClick={() => {
                                                removeEvent(popupInfo.ev)
                                                setPopupInfo(null)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        // someone else's: Join, disabled on conflict
                                        <button
                                            disabled={hasConflict(popupInfo.ev)}
                                            onClick={() => {
                                                joinEvent(popupInfo.ev)
                                                setPopupInfo(null)
                                            }}
                                        >
                                            Join Event
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
