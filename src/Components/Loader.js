import React from 'react'

export default function Loader({ show }) {

    return (
        <>
            {show ? <div className="loader text-center">
                <h2>  Loading <div className="spinner-grow text-danger" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </h2>
            </div> : null}
        </>


    )
}
