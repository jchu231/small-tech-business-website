module.exports = {
  siteMetadata: {
    title: `Small Tech Business`,
    author: {
      name: `Justin Chu`,
      summary: `, a software developer based in Seattle, WA. He is currently building his own small tech business, Mobo Games.`,
    },
    description: `Small Tech Business is a curated newsletter for people looking for inspiration and learning around starting their own small internet or technology business.`,
    siteUrl: `https://smalltechbusiness.com/`,
    social: {
      indieHackers: `jkchu`,
      twitter: `jstnchu`,
      website: `https://jkchu.com`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-twitter-cards`,
            options: {
              // title: 'anti/pattern', // website title
              // separator: '|', // default
              author: 'by Justin Chu',
              background: require.resolve('./content/assets/stb-twitter-card-image-2.png'), // path to 1200x630px file or hex code, defaults to black (#000000)
              fontColor: '#242d3c', // defaults to white (#ffffff)
              titleFontSize: 72, // default
              subtitleFontSize: 48, // default
              fontFile: require.resolve('./content/assets/fonts/Aleo-Regular.ttf'),
              useFrontmatterSlug: false // default, if true it will use the slug defined in the post frontmatter
            },
          }
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Small Tech Business`,
        short_name: `STB`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#65b8e8`,
        display: `minimal-ui`,
        icon: `content/assets/stb-logo.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    // Plausible.io integration
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `smalltechbusiness.com`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/
        }
      }
    },
  ],
}
