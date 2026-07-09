import Box from '@mui/material/Box'
import { colors } from '../theme'

export default function Ornament() {
  return (
    <Box sx={{ mx: '0.7rem', my: '0.45rem', height: 'var(--hairline)', background: colors.line }} />
  )
}
