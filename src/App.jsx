// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route }       from 'react-router-dom'
import Login                   from './Login.jsx'
import Home                    from './Home.jsx'
import Schedule                from './Schedule.jsx'

export default function App() {
    // load saved name from localStorage (so refresh keeps you logged in)
    const [userName, setUserName] = useState(
        () => localStorage.getItem('userName') || ''
    )
    const [events, setEvents] = useState([])

    // keep localStorage in sync
    useEffect(() => {
        if (userName) localStorage.setItem('userName', userName)
        else localStorage.removeItem('userName')
    }, [userName])

    // show login if we don’t have a name yet
    if (!userName) {
        return <Login onLogin={setUserName} />
    }

    return (
        <div>
            {/* header with logout */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                background: '#f7f7f7',
                borderBottom: '1px solid #ddd'
            }}>
                <span>Logged in as <strong>{userName}</strong></span>
                <button onClick={() => setUserName('')}>
                    Logout
                </button>
            </header>

            {/* app routes */}
            <Routes>

                <Route
                    path="/"
                    element={
                        <Home
                            userName={userName}
                            events={events}
                            setEvents={setEvents}
                        />
                    }
                />
                <Route
                    path="schedule"
                    element={
                        <Schedule
                            userName={userName}
                            events={events}
                            setEvents={setEvents}
                        />
                    }
                />

            </Routes>
        </div>
    )
}
