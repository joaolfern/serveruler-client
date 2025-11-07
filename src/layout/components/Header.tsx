import CachedIcon from '@mui/icons-material/Cached'
import GitHub from '@mui/icons-material/GitHub'
import { Chip, IconButton, Stack, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { SelectEnv } from './SelectEnv'

export function Header() {
  function handleOpenGithub() {
    window.open('https://github.com/joaolfern/serveruler-client', '_blank')
  }

  return (
    <AppBar position='static'>
      <Container maxWidth='lg'>
        <Toolbar disableGutters style={{ minHeight: 60 }}>
          <img
            src='https://i.imgur.com/EXY2Msb.png'
            height={30}
            style={{ marginRight: 14 }}
          />
          <Typography
            variant='h6'
            noWrap
            component='p'
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
            }}
          >
            Serveruler
          </Typography>
          <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton onClick={() => window.location.reload()}>
              <CachedIcon />
            </IconButton>
            <SelectEnv />
            <Tooltip title='View source on GitHub' arrow>
              <Chip
                icon={<GitHub style={{ fontSize: 18, marginLeft: '10px' }} />}
                label='Github'
                size='medium'
                variant='outlined'
                onClick={handleOpenGithub}
              />
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
