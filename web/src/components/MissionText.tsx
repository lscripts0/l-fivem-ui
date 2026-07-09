import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { colors, fonts } from '../theme'
import { rich } from '../lib/rich'
import type { MissionTextData } from '../types'

interface MissionTextProps {
  data: MissionTextData
  hiding: boolean
}

const outline = [
  '0 0.1rem 0.25rem rgba(0, 0, 0, 0.95)',
  '0 0 0.1rem rgba(0, 0, 0, 0.95)',
  '0.05rem 0.05rem 0 rgba(0, 0, 0, 0.9)',
  '-0.05rem -0.05rem 0 rgba(0, 0, 0, 0.9)'
].join(', ')

export default function MissionText({ data, hiding }: MissionTextProps) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const visible = shown && !hiding

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'max-content',
        maxWidth: '46rem',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 250ms ease-out',
        pointerEvents: 'none'
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: '1.15rem',
          lineHeight: 1.35,
          color: colors.text,
          textShadow: outline,
          '& span': { textShadow: outline }
        }}
      >
        {rich(data.text, colors.accent)}
      </Typography>
    </Box>
  )
}
