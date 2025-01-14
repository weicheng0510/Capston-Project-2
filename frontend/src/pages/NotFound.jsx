import React from 'react'
import { Link } from 'react-router'

function NotFound() {
    return (
        <div className='mt-6 text-lg text-center'>
            <h2>Page Not Found</h2>
            <p>The page you are looking for doesn't exist.</p>
            <p>Go to <Link to="/" className='text-blue-600'>Home</Link></p>
        </div>
    )
}

export default NotFound