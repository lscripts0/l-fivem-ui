import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps } from '@mui/material/styles'
import { colors, fonts, hexPanel } from '../theme'
import { rich } from '../lib/rich'
import { slideVariant } from '../lib/slide'
import type { ObjectivesData } from '../types'
import Ornament from './Ornament'

interface ObjectivesProps {
  data: ObjectivesData
  hiding: boolean
}

export default function Objectives({ data, hiding }: ObjectivesProps) {
  const [shown, setShown] = useState(false)
  const variant = slideVariant(data.position, 'right-center')

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const visible = shown && !hiding

  return (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '10rem',
        maxWidth: '15rem',
        px: '0.7rem',
        py: '0.5rem',
        isolation: 'isolate', ...hexPanel,
        transform: visible ? variant.rest : variant.hidden,
        opacity: visible ? 1 : 0,
        transition: 'transform 250ms ease-out, opacity 250ms ease-out',
        ...variant.anchor
      } as SxProps}
    >      {data.title && (
        <>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontWeight: 600,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: colors.accentSoft,
              lineHeight: 1.2
            }}
          >
            {rich(data.title, colors.text)}
          </Typography>
          <Ornament />
        </>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', mt: data.title ? '0.1rem' : 0 }}>
        {data.entries.map((entry) => {
          const done = entry.done === true
          return (
            <Box key={entry.id} sx={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '0.8rem',
                  height: '0.8rem',
                  flexShrink: 0,
                  border: `var(--hairline) solid ${done ? colors.success : 'rgba(255, 255, 255, 0.55)'}`,
                  borderRadius: '0.12rem',
                  backgroundColor: done ? colors.success : 'transparent'
                }}
              >
                {done && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '52%',
                      top: '46%',
                      width: '0.18rem',
                      height: '0.34rem',
                      borderRight: '0.11rem solid #ffffff',
                      borderBottom: '0.11rem solid #ffffff',
                      transform: 'translate(-50%, -50%) rotate(45deg)'
                    }}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: '0.78rem',
                  lineHeight: 1.25,
                  color: done ? colors.success : colors.text,
                  opacity: done ? 0.85 : 1,
                  textDecoration: done ? 'line-through' : 'none',
                  textDecorationThickness: 'var(--hairline)'
                }}
              >
                {entry.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
