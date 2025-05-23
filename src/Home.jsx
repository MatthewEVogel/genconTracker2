// src/Home.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home({ userName, events, setEvents }) {
    const [url, setUrl] = useState('')
    const navigate      = useNavigate()

    // your previous parsing helpers here...
    const parseStartMins = raw => { /* … */ }
    const parseDurationMins = raw => { /* … */ }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!url.trim()) {
            alert('Please enter an event URL or path.')
            return
        }

        try {
            const path = url.startsWith('http')
                ? url.replace(/^https?:\/\/[^/]+/, '')
                : url

            const resp = await fetch(`/api${path}`)
            if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`)
            const htmlString = await resp.text()
            const doc = new DOMParser().parseFromString(htmlString, 'text/html')

            const lines = doc.body.innerText
                .split('\n').map(l => l.trim()).filter(Boolean)
            const getBlock = label => {
                const idx = lines.findIndex(l => l.startsWith(label))
                return idx >= 0 ? lines[idx+1] : null
            }

            const title    = getBlock('Title:')
            const startRaw = getBlock('Start Date & Time:')
            const duration = getBlock('Duration:')
            if (!title || !startRaw || !duration) {
                alert('Failed to extract event details.')
                return
            }

            const [day] = startRaw.split(',')
            const event = {
                person:   userName,     // ← use the logged-in name
                title,
                day:      day.trim(),
                start:    startRaw,
                duration
            }

            // optional: conflict check as before…

            setEvents(prev => [...prev, event])
            navigate('/schedule')
        } catch (err) {
            console.error(err)
            alert('Error fetching or parsing event.')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Add Event for <em>{userName}</em></h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    placeholder="URL or path (e.g. /events/281023)"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit">Add to Schedule</button>
            </form>
        </div>
    )
}
