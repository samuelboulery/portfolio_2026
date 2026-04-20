import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/windows/mdxComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
