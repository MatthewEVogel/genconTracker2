// src/Login.jsx
import { useState } from 'react'

export default function Login({ onLogin }) {
    const [name, setName] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        const trimmed = name.trim()
        if (trimmed) {
            onLogin(trimmed)
        } else {
            alert('Please enter your name.')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Who are you?</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit">Continue</button>
            </form>
        </div>
    )
}
