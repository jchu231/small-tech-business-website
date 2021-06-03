/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            website
            indieHackers
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <div className="bio">
      {avatar && (
        <Image
          fixed={avatar}
          alt={author?.name || ``}
          className="bio-avatar"
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      )}
      {author?.name && (
        <p>
          Written by <strong>{author.name}</strong>{author?.summary || null}
          <a href={`https://gomobo.app/`}>
            Mobo Games
          </a>.
          {` `}
          <br />
          <a href={`https://twitter.com/${social?.twitter || ``}`}>
            Twitter
          </a>
          &nbsp;
          &#8226;
          &nbsp;
          <a href={`${social?.website || ``}`}>
            Website
          </a>
          &nbsp;
          &#8226;
          &nbsp;
          <a href={`https://www.indiehackers.com/${social?.indieHackers || ``}`}>
            Indie Hackers
          </a>
        </p>
      )}
    </div>
  )
}

export default Bio
