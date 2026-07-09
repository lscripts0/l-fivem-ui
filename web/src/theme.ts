import { createTheme } from '@mui/material/styles'

export const colors = {
  text: 'var(--ui-text, #f2f2f2)',
  textDim: 'var(--ui-text-dim, rgba(255, 255, 255, 0.72))',
  accent: 'var(--ui-accent, #2CB0FD)',
  accentSoft: 'var(--ui-accent-soft, #6cc5fd)',
  accentGlow: 'var(--ui-accent-glow, rgba(44, 176, 253, 0.5))',
  line: 'var(--ui-line, rgba(255, 255, 255, 0.22))',
  panel: 'var(--ui-panel, rgba(7, 7, 7, 0.93))',
  panelEdge: 'var(--ui-panel-edge, rgba(255, 255, 255, 0.15))',
  highlight: 'var(--ui-highlight, rgba(44, 176, 253, 0.85))',
  success: 'var(--ui-success, #43ff36)',
  successGlow: 'var(--ui-success-glow, rgba(67, 255, 54, 0.25))',
  danger: 'var(--ui-danger, #ff3636)',
  dangerGlow: 'var(--ui-danger-glow, rgba(255, 54, 54, 0.25))',
  innerGlow: 'inset 0 0 1.7vh var(--ui-glow, rgba(255, 255, 255, 0.15))'
}

export const hexPanel = {
  background: colors.panel,
  border: 'var(--hairline) solid var(--ui-panel-edge, rgba(255,255,255,0.15))',
  borderRadius: '0.25rem',
  boxShadow: 'inset 0 0 1.7vh var(--ui-glow, rgba(255,255,255,0.15)), 0 0.4rem 1.2rem rgba(0,0,0,0.45)'
}

export const fonts = {
  body: '"Rajdhani", "Segoe UI", sans-serif',
  display: '"Rajdhani", "Segoe UI", sans-serif',
  mono: '"Share Tech Mono", "Consolas", monospace'
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2CB0FD' },
    text: { primary: '#f2f2f2', secondary: 'rgba(255, 255, 255, 0.72)' },
    background: { default: 'transparent', paper: 'rgba(7, 7, 7, 0.82)' }
  },
  typography: {
    fontFamily: fonts.body,
    button: {
      fontFamily: fonts.display,
      fontWeight: 600,
      letterSpacing: 'normal',
      textTransform: 'uppercase'
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: { disableRipple: true }
    }
  }
})
