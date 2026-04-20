import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [["rehype-slug"], ["rehype-prism-plus", { ignoreMissing: true }]],
  },
});

export const lighthouseBudget = {
  performance: 95,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
} as const;

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
};

export default withMDX(nextConfig);
