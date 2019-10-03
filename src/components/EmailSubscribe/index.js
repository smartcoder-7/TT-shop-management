import React, { useState } from 'react'

const EmailSubscribe = () => {
  const [value, setValue] = useState('')
  
  return (
    <div id="mc_embed_signup">
      <form action="https://nyc.us20.list-manage.com/subscribe/post?u=69fca137fed074a05205847a9&amp;id=45fa0b8380" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
        <div id="mc_embed_signup_scroll">
        
        <div className="mc-field-group">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            name="EMAIL" 
            className="required email" 
            id="mce-EMAIL"
          />
        </div>
        <div id="mce-responses" className="clear">
          <div className="response" id="mce-error-response" style={{display:"none"}}></div>
          <div className="response" id="mce-success-response" style={{display:"none"}}></div>
        </div>
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input 
            type="text"
            name="b_69fca137fed074a05205847a9_45fa0b8380" 
            tabIndex="-1" 
            defaultValue=""
          />
        </div>
        <br />
        <div className="clear" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
        <input data-link type="submit" value="Sign Up" name="subscribe" id="mc-embedded-subscribe" className="button" /></div>
        </div>
      </form>
    </div>
  )
}

export default EmailSubscribe