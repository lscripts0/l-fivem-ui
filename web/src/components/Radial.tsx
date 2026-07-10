import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { colors, fonts } from '../theme'
import { fetchNui } from '../lib/nui'
import { faClass } from '../lib/fa'
import type { RadialData, RadialItem } from '../types'

interface RadialProps {
  data: RadialData
}

const CX = 50
const CY = 50
const R_OUTER = 48
const R_BODY = 46.5
const R_HUB = 16
const R_ICON = 33
const R_ARC = 18.5
const R_HIT_IN = R_HUB + 0.5
const GAP = 3

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function sectorPath(rIn: number, rOut: number, a0: number, a1: number) {
  const p1 = polar(rOut, a0)
  const p2 = polar(rOut, a1)
  const p3 = polar(rIn, a1)
  const p4 = polar(rIn, a0)
  const large = (a1 - a0) % 360 > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y} Z`
}

function arcPath(r: number, a0: number, a1: number) {
  const p1 = polar(r, a0)
  const p2 = polar(r, a1)
  const large = (a1 - a0) % 360 > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`
}

export default function Radial({ data }: RadialProps) {
  const items = data.items
  const [hovered, setHovered] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const step = items.length > 0 ? 360 / items.length : 0

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const back = () => fetchNui('radial:back', {})
  const select = (item: RadialItem) => fetchNui('radial:select', { id: item.id })
  const hover = (index: number | null) => {
    setHovered((prev) => {
      if (index !== null && index !== prev) fetchNui('radial:nav', {})
      return index
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'x' || event.key === 'X' || event.key === 'Backspace') {
        event.preventDefault()
        back()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const hoverItem = hovered !== null ? items[hovered] : null
  const position = data.position === 'left' || data.position === 'center' ? data.position : 'right'
  const anchor = position === 'center'
    ? { justifyContent: 'center' }
    : position === 'left'
      ? { justifyContent: 'flex-start', pl: '20vw' }
      : { justifyContent: 'flex-end', pr: '20vw' }
  const glowX = position === 'center' ? '50%' : position === 'left' ? '35%' : '65%'

  return (
    <Box
      onContextMenu={(event) => {
        event.preventDefault()
        back()
      }}
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        background: `radial-gradient(circle at ${glowX} 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 70%)`,
        pointerEvents: 'auto',
        opacity: shown ? 1 : 0,
        transition: 'opacity 160ms ease',
        ...anchor
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '18rem',
          height: '18rem',
          transform: shown ? 'scale(1)' : 'scale(0.9)',
          opacity: shown ? 1 : 0,
          transition: 'transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 180ms ease'
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 100 100"
          sx={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0.6vh 2vh rgba(0, 0, 0, 0.55))' }}
        >
          <defs>
            <radialGradient id="lfui-rg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.30)" />
              <stop offset="62%" stopColor="rgba(8,8,8,0.55)" />
              <stop offset="100%" stopColor="rgba(12,12,12,0.78)" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R_BODY} fill="url(#lfui-rg)" />
          <circle
            cx={CX}
            cy={CY}
            r={R_OUTER}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth={0.35}
            style={{ filter: 'drop-shadow(0 0 0.5vh rgba(255, 255, 255, 0.35))' }}
          />
          {items.map((s, i) => {
            const a0 = i * step
            const a1 = (i + 1) * step
            const active = hovered === i
            const dot = s.hasSub ? polar(R_ICON + 7, (a0 + a1) / 2) : null
            return (
              <g
                key={s.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => hover(i)}
                onMouseLeave={() => hover(hovered === i ? null : hovered)}
                onClick={() => select(s)}
              >
                <path
                  d={sectorPath(R_HUB + 0.5, R_BODY - 0.5, a0 + GAP / 2, a1 - GAP / 2)}
                  fill={colors.accent}
                  style={{ opacity: active ? 0.14 : 0, transition: 'opacity 140ms ease' }}
                />
                <path
                  d={arcPath(R_ARC, a0 + GAP / 2, a1 - GAP / 2)}
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  style={{ opacity: active ? 1 : 0, transition: 'opacity 140ms ease', filter: `drop-shadow(0 0 0.5vh ${colors.accent})` }}
                />
                {dot && <circle cx={dot.x} cy={dot.y} r={0.9} fill={colors.accent} style={{ opacity: active ? 1 : 0.7 }} />}
                <path d={sectorPath(R_HIT_IN, R_BODY, a0, a1)} fill="#000" fillOpacity={0} />
              </g>
            )
          })}
          <circle cx={CX} cy={CY} r={R_HUB} fill="rgba(6, 6, 6, 0.88)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth={0.3} />
        </Box>
        {items.map((s, i) => {
          const pos = polar(R_ICON, i * step + step / 2)
          const active = hovered === i
          return (
            <Box
              key={s.id}
              sx={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              {s.icon && (
                <Box
                  component="i"
                  className={faClass(s.icon)}
                  sx={{
                    fontSize: '1rem',
                    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
                    filter: active ? `drop-shadow(0 0 0.5vh ${colors.accent})` : 'none',
                    transition: 'color 120ms ease'
                  }}
                />
              )}
            </Box>
          )
        })}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '26%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: '100%',
              transform: 'translateX(-50%)',
              mb: '0.5vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hoverItem ? 1 : 0,
              color: colors.accentSoft,
              filter: `drop-shadow(0 0 0.8vh ${colors.accent})`,
              transition: 'opacity 120ms ease'
            }}
          >
            {hoverItem?.icon && <Box component="i" className={faClass(hoverItem.icon)} sx={{ fontSize: '1.5rem', color: 'inherit' }} />}
          </Box>
          <Box
            sx={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: hoverItem ? '0.85rem' : '1rem',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              color: hoverItem ? '#ffffff' : colors.accentSoft,
              textShadow: hoverItem ? '0 0 1vh rgba(255, 255, 255, 0.5)' : `0 0 1.2vh ${colors.accentSoft}`
            }}
          >
            {hoverItem ? hoverItem.label : ''}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)',
              mt: '0.5vh',
              whiteSpace: 'nowrap',
              fontFamily: fonts.body,
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03rem',
              color: 'rgba(255, 255, 255, 0.32)'
            }}
          >
            {(data.depth ?? 1) > 1 ? 'Right click / Back' : 'X / ESC'}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
