import type { ReactNode } from 'react';

type AdmonitionProps = {
  children: ReactNode;
  title?: ReactNode;
  type?: 'note' | 'tip' | 'info' | 'caution' | 'warning' | 'danger';
};

const typeClassName = {
  caution: 'warning',
  danger: 'danger',
  info: 'info',
  note: 'note',
  tip: 'tip',
  warning: 'warning',
};

export default function Admonition({
  children,
  title,
  type = 'note',
}: AdmonitionProps) {
  const normalizedType = typeClassName[type] ?? 'note';

  return (
    <div className={`rspress-doc admonition admonition-${normalizedType}`}>
      {title ? <p className="admonition-title">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
