import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Layout from "./layout"
import SEO from "./seo"
import Bio from "./bio"

// const Links = () => {
//   const data = useStaticQuery(graphql`
//     query {
//       site {
//         siteMetadata {
//           title
//         }
//       }
//       allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
//         nodes {
//           excerpt
//           fields {
//             slug
//           }
//           frontmatter {
//             date(formatString: "MMMM DD, YYYY")
//             title
//             description
//           }
//         }
//       }
//     }
//   `);
//
//   const siteTitle = data.site.siteMetadata?.title || `Title`
//   const posts = data.allMarkdownRemark.nodes;
//
//   if (posts.length === 0) {
//     return (
//       <Layout location={this.props.location} title={siteTitle}>
//         <SEO title="Archive" />
//         <Bio />
//         <p>
//           No blog posts found. Add markdown posts to "content/blog" (or the
//           directory you specified for the "gatsby-source-filesystem" plugin in
//           gatsby-config.js).
//         </p>
//       </Layout>
//     )
//   }
//
//   return (<ol style={{ listStyle: `none` }}>
//     {posts.map(post => {
//       const title = post.frontmatter.title || post.fields.slug
//
//       return (
//         <p>link</p>
//       )
//     })}
//   </ol>
//   )
// }
//
// export default Links