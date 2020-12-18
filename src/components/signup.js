/**
 * Signup component that renders iframe signup for newsletter
 */

import React from "react"

const Signup = () => {

  return (
    <div className="signup">
      <iframe src="https://smalltechbusiness.substack.com/embed" width="480" height="320"
              style={{border:'1px solid #EEE', background:'white'}} frameBorder="0" scrolling="no"></iframe>
    </div>
  )
}

export default Signup