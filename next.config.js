/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = require('@next/mdx')()
const removeImports = require('next-remove-imports')();

module.exports = removeImports(withMDX(nextConfig))
