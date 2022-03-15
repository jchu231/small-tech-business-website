import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Signup from "../components/signup"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.slice(0, 3);

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO location={location} title="Home" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle} latest={posts[0]}>
      <SEO title="Home" />
      <h1 className="landing-header">Learn from successful indie founders
      </h1>
      <div className="hero-card landing-list-container">
        <ul className="landing-list">
          <li><strong>In-depth articles</strong> with actionable strategies</li>
          <li>Case studies of successful <strong>indie founded business</strong></li>
          <li><strong>Frameworks and strategies</strong> to help you build and grow your business</li>
        </ul>
      </div>

      <Signup />
      <Bio />
      <hr />
      <div className="spacer"> </div>
      <h3>Latest Articles</h3>
      <ol style={{ listStyle: `none`, marginLeft: `0` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <Link to={post.fields.slug} itemProp="url">
                <article
                  className="post-list-item article-card article-link"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <span itemProp="headline">{title}</span>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || "",
                      }}
                      itemProp="description"
                    />
                    <p className="article-footer">
                      <span className="t-Caps u-Arrow" href="">Read now</span>
                    </p>
                  </section>
                </article>
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="spacer"> </div>
      <a href="/archive">View Archive →</a>
      <div className="spacer"> </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
