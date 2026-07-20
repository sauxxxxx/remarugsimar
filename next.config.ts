import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  poweredByHeader: false,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
