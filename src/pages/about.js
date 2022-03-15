import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Signup from "../components/signup"

const About = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="About"/>
      <h2>About</h2>
      <p>
        Small Tech Business is a blog and newsletter written by Justin Chu, an indie founder and software developer based out of Seattle, WA.
      </p>
      <p>
        Each Small Tech Business article takes a look at successful tech businesses led by indie founders and tries to extract strategies and learnings for the rest of us to follow.
      </p>
      <p>
        Follow Justin on <a href={`https://twitter.com/${social?.twitter || ``}`}>Twitter</a> for latest updates on what he is up to.
      </p>
      <br/>
      <Signup/>
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
