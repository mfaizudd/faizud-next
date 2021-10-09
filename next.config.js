/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["@uiw/react-md-editor", "rehype"]);
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [
      "u.cubeupload.com"
    ]
  },
})
