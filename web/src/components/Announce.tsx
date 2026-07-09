import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CampaignOutlined from '@mui/icons-material/CampaignOutlined'
import { colors, fonts, hexPanel } from '../theme'
import { rich } from '../lib/rich'
import type { AnnounceData } from '../types'

interface AnnounceProps {
  data: AnnounceData
  onDone: () => void
}

export default function Announce({ data, onDone }: AnnounceProps) {
  const [shown, setShown] = useState(false)
  const duration = data.duration && data.duration > 0 ? data.duration : 5000

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    const hide = setTimeout(() => setShown(false), duration)
    const done = setTimeout(onDone, duration + 350)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hide)
      clearTimeout(done)
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1.1rem',
        left: '50%',
        transform: shown ? 'translateX(-50%)' : 'translateX(-50%) translateY(-0.6rem)',
        opacity: shown ? 1 : 0,
        transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        minWidth: '30rem',
        maxWidth: '50rem',
        px: '2.6rem',
        py: '0.4rem',
        pb: '0.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        ...hexPanel
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '0.45rem',
          left: '0.55rem',
          width: '1.5rem',
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `var(--hairline) solid ${colors.accent}`,
          borderRadius: '0.15rem',
          backgroundColor: 'rgba(0, 0, 0, 0.35)'
        }}
      >
        <CampaignOutlined sx={{ fontSize: '0.95rem', color: colors.accent, filter: `drop-shadow(0 0 0.35rem ${colors.accentGlow})` }} />
      </Box>
      <Typography
        sx={{
          position: 'relative',
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: '1.05rem',
          textTransform: 'uppercase',
          color: colors.accentSoft,
          lineHeight: 1.25,
          mt: '0.15rem',
          mb: data.subtitle ? '0.15rem' : '0.15rem'
        }}
      >
        {rich(data.title, colors.text)}
      </Typography>
      {data.subtitle && (
        <>
          <Box
            sx={{
              position: 'relative',
              height: 'var(--hairline)',
              background: 'rgba(255, 255, 255, 0.25)',
              mx: '5rem',
              mb: '0.2rem'
            }}
          />
          <Typography
            sx={{
              position: 'relative',
              fontSize: '0.75rem',
              fontStyle: 'italic',
              color: colors.textDim,
              mb: '0.25rem'
            }}
          >
            {rich(data.subtitle, colors.accent)}
          </Typography>
        </>
      )}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '0.18rem',
          background: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: shown ? '0%' : '100%',
            background: colors.accent,
            boxShadow: `0 0 0.4rem ${colors.accentGlow}`,
            transition: `width ${duration}ms linear`
          }}
        />
      </Box>
    </Box>
  )
}
