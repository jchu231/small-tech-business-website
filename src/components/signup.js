/**
 * Signup component that renders iframe signup for newsletter
 */

import React from "react"

const Signup = () => {

  return (
    <>
      <div className="signup-text">
        <p>Join 1,100+ others in learning the latest indie tech trends and strategies.</p>
      </div>
      <div className="signup">
        <iframe src="https://smalltechbusiness.substack.com/embed" width="480" height="102"
                style={{border:'1px solid transparent', background:'white'}} frameBorder="0" scrolling="no"></iframe>
      </div>
    </>
  )
}

export default Signup
