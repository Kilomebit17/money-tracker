import type { FC } from 'react'

interface LogoLinkProps {
  href: string
  label: string
  src: string
}

export const LogoLink: FC<LogoLinkProps> = ({ href, label, src }) => (
  <a className="logo-link" href={href} target="_blank" rel="noreferrer">
    <div className="logo-link__icon">
      <img src={src} alt={label} />
    </div>
    <span className="logo-link__label">{label}</span>
  </a>
)

