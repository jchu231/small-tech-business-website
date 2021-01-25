/**
 * Add discussion links to posts
 */

import React from "react"

import IndieHackersIcon from "../../content/assets/indie-hackers-logo__dark.inline.svg";

const Discuss = ({ indieHackersLink }) => {

  return (
    <a className="discuss-link" href={indieHackersLink}>
      <IndieHackersIcon />
      Discuss this article on Indie Hackers
    </a>
  )
}

export default Discuss