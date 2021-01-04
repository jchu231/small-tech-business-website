import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import Image from "gatsby-image"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      logo: file(absolutePath: { regex: "/stb-logo.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  let header

  const logo = data?.logo?.childImageSharp?.fixed;

  header = (
    <Link className="header-link-home" to="/">
      <div className="header-link-home-inner-flex">
        <Image
          fixed={logo}
          alt={`Small Tech Business logo`}
          className="stb-logo"
        />
        <div className="header-link-home-title">{title}</div>
      </div>
    </Link>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, {title}
      </footer>
    </div>
  )
}

export default Layout
