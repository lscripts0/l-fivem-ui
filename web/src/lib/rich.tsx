import { Fragment, type ReactNode } from 'react'

export function rich(text: string | undefined, color: string): ReactNode {
  if (typeof text !== 'string' || text === '') return text ?? null
  const lines = text.split('\n')
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
          <span key={pi} style={{ color, fontWeight: 600 }}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={pi}>{part}</Fragment>
        )
      )}
    </Fragment>
  ))
}
