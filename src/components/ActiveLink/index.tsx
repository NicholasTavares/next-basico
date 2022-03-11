import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface IActiveLinkProps extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({ children, activeClassName, ...otherProps }: IActiveLinkProps) {
  const { asPath } = useRouter()
  const className = asPath === otherProps.href ? activeClassName : ''

  return (
    <Link {...otherProps}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  )
}