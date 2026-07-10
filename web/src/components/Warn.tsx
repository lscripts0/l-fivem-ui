import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { colors, fonts, hexPanel } from '../theme'
import { rich } from '../lib/rich'
import { useNuiEvent } from '../lib/nui'
import type { WarnData } from '../types'
import Ornament from './Ornament'

interface WarnProps {
  data: WarnData
  hiding: boolean
}

export default function Warn({ data, hiding }: WarnProps) {
  const [shown, setShown] = useState(false)
  const [progress, setProgress] = useState(0)

  useNuiEvent<{ value: number }>('warn:progress', (event) => setProgress(Math.min(event.value, 1)))

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (hiding) setShown(false)
  }, [hiding])

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.92))',
        opacity: shown ? 1 : 0,
        transition: 'opacity 250ms ease-out'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          isolation: 'isolate', ...hexPanel,
          width: '24rem',
          px: '1.8rem',
          py: '1rem',
          textAlign: 'center'
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.mono,
            fontWeight: 400,
            fontSize: '1.3rem',
            textTransform: 'uppercase',
            color: colors.text,
            lineHeight: 1.2
          }}
        >
          {data.title ?? 'Warning'}
        </Typography>
        <Ornament />
        <Typography sx={{ fontSize: '0.85rem', color: colors.text, lineHeight: 1.4 }}>{rich(data.message, colors.accent)}</Typography>
        {data.author && (
          <Typography sx={{ fontSize: '0.72rem', fontStyle: 'italic', color: colors.textDim, mt: '0.3rem' }}>
            {data.author}
          </Typography>
        )}
        <Box sx={{ mt: '0.9rem' }}>
          <Typography
            sx={{
              fontFamily: fonts.display,
              fontSize: '0.62rem',
              textTransform: 'uppercase',
              color: colors.textDim,
              mb: '0.3rem'
            }}
          >
            {data.holdLabel ?? 'Hold ENTER to acknowledge'}
          </Typography>
          <Box sx={{ height: '0.22rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '0.1rem', overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${progress * 100}%`,
                background: 'rgba(255, 255, 255, 0.75)',
                transition: 'width 80ms linear'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
