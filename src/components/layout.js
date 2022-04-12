import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import Image from "gatsby-image"

const Layout = ({ location, title, latest, children }) => {
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
  let navbar

  const logo = data?.logo?.childImageSharp?.fixed;

  header = (
    <div className="stb--navbar">

    </div>
  )

  navbar = (
    <div className="stb--navbar">
      <div className="column">
        <h1 className="logo">
          <Link className="header-link-home" to="/">
            <div className="header-link-home-inner-flex logo-card">
              <Image
                fixed={logo}
                alt={`Small Tech Business logo`}
                className="stb-logo"
              />
              <div className="header-link-home-title">{title}</div>
            </div>
          </Link>
        </h1>

        {latest && <Link className="out-now" to={latest.fields.slug} itemProp="url">
          <div className="IssueTitle tiny">
            <div className="t-Caps meta tiny">
              <span>NEW</span>
            </div>
            <h3 className="t-IssueTitle title">{latest.frontmatter.title}</h3>
          </div>
        </Link>}
        <ul className="nav">
          <li><a href="/archive/"><span>Archive</span></a></li>
          <li><a href="/about/"><span>About</span></a></li>
        </ul>
      </div>
    </div>
  )

  return (
    <>
      <nav className="stb--page-nav">
        {navbar}
      </nav>
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <header className="global-header">{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, {title}
        </footer>
      </div>
    </>
  )
}

export default Layout
