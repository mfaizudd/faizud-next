/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["codejar"]);
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [
      "u.cubeupload.com"
    ]
  },
})
