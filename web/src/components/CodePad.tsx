import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import type { SxProps } from '@mui/material/styles'
import { colors, fonts, hexPanel } from '../theme'
import { rich } from '../lib/rich'
import { fetchNui } from '../lib/nui'
import type { PinPadData } from '../types'
import Ornament from './Ornament'

interface CodePadProps {
  data: PinPadData
  onDone: () => void
}

const buttonSx = (accent: string, glow: string): SxProps => ({
  flex: 1,
  fontFamily: fonts.display,
  fontWeight: 600,
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: 'normal',
  color: colors.text,
  py: '0.32rem',
  border: `var(--hairline) solid ${colors.panelEdge}`,
  borderRadius: '2px',
  boxShadow: colors.innerGlow,
  '&:hover': {
    color: accent,
    borderColor: accent,
    boxShadow: `inset 0 0 1.7vh ${glow}`
  }
})

const keySx: SxProps = {
  width: '2.9rem',
  height: '2.4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: fonts.display,
  fontSize: '1.35rem',
  color: colors.text,
  border: `var(--hairline) solid ${colors.panelEdge}`,
  borderRadius: '0.15rem',
  background: 'rgba(0, 0, 0, 0.45)',
  boxShadow: colors.innerGlow,
  transition: 'color 120ms ease-out, border-color 120ms ease-out, background 120ms ease-out',
  '&:hover': {
    color: colors.accent,
    borderColor: colors.accent,
    background: 'rgba(0, 0, 0, 0.6)',
    boxShadow: `inset 0 0 1.2vh ${colors.accentGlow}`
  }
}

export default function CodePad({ data, onDone }: CodePadProps) {
  const length = data.length && data.length > 0 ? Math.min(Math.floor(data.length), 12) : 4
  const [code, setCode] = useState('')
  const codeRef = useRef('')
  const doneRef = useRef(false)
  codeRef.current = code

  const cancel = () => {
    if (doneRef.current) return
    doneRef.current = true
    fetchNui('pinpad:result', { canceled: true })
    onDone()
  }

  const submit = () => {
    if (doneRef.current) return
    doneRef.current = true
    fetchNui('pinpad:result', { canceled: false, code: codeRef.current })
    onDone()
  }

  const press = (digit: string) => {
    if (doneRef.current) return
    setCode((prev) => (prev.length < length ? prev + digit : prev))
    fetchNui('pinpad:nav', {})
  }

  const back = () => {
    if (doneRef.current) return
    setCode((prev) => prev.slice(0, -1))
    fetchNui('pinpad:nav', {})
  }

  const clear = () => {
    if (doneRef.current) return
    setCode('')
    fetchNui('pinpad:nav', {})
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancel()
      else if (event.key === 'Enter') submit()
      else if (event.key === 'Backspace') back()
      else if (event.key >= '0' && event.key <= '9') press(event.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.45)',
        pointerEvents: 'auto'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: '1.1rem',
          py: '0.8rem',
          isolation: 'isolate',
          ...hexPanel
        }}
      >
        {data.title && (
          <>
            <Typography
              sx={{
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: '1.05rem',
                textTransform: 'uppercase',
                textAlign: 'center',
                color: colors.accentSoft,
                lineHeight: 1.2
              }}
            >
              {rich(data.title, colors.text)}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Ornament />
            </Box>
          </>
        )}
        <Box sx={{ display: 'flex', gap: '0.35rem', my: '0.5rem' }}>
          {Array.from({ length }, (_, index) => {
            const active = index === code.length
            return (
              <Box
                key={index}
                sx={{
                  width: '1.7rem',
                  height: '2.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: `var(--hairline) solid ${active ? colors.highlight : colors.panelEdge}`,
                  borderRadius: '0.12rem',
                  boxShadow: active ? colors.innerGlow : 'none'
                }}
              >
                <Typography sx={{ fontFamily: fonts.display, fontSize: '1.35rem', color: colors.text }}>
                  {code[index] ?? ''}
                </Typography>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0.35rem' }}>
          {keys.map((digit) => (
            <ButtonBase key={digit} onClick={() => press(digit)} sx={keySx}>
              {digit}
            </ButtonBase>
          ))}
          <ButtonBase
            onClick={clear}
            sx={{ ...keySx, fontFamily: fonts.display, fontSize: '0.7rem', textTransform: 'uppercase' } as SxProps}
          >
            C
          </ButtonBase>
          <ButtonBase onClick={() => press('0')} sx={keySx}>
            0
          </ButtonBase>
          <ButtonBase
            onClick={back}
            sx={{ ...keySx, fontSize: '1.1rem' } as SxProps}
          >
            &#9003;
          </ButtonBase>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem', mt: '0.55rem', width: '100%' }}>
          <ButtonBase onClick={cancel} sx={buttonSx(colors.danger, colors.dangerGlow)}>
            {data.cancelLabel ?? 'Cancel'}
          </ButtonBase>
          <ButtonBase onClick={submit} sx={buttonSx(colors.success, colors.successGlow)}>
            {data.submitLabel ?? 'Confirm'}
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  )
}
