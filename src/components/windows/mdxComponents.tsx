import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";
import styles from "./ProjectWindow.module.css";

function ProjectLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      {...rest}
      href={href}
      className={styles.link}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function H1({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Title {...rest} as="h1" size="l">
      {children}
    </Title>
  );
}

function H2({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Title {...rest} as="h2" size="s">
      {children}
    </Title>
  );
}

function P({ children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Paragraph {...rest} size="m">
      {children}
    </Paragraph>
  );
}

export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  p: P,
  a: ProjectLink,
};
