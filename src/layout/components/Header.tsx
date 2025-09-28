import CachedIcon from '@mui/icons-material/Cached'
import GitHub from '@mui/icons-material/GitHub'
import { Chip, IconButton, Stack } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useUserData } from '../../hooks/useIps'
import { SelectEnv } from './SelectEnv'

export function Header() {
  const { envOptions, selectedEnv, setSelectedEnv } = useUserData()

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
              color: 'inherit'
            }}
          >
            Serveruler
          </Typography>
          <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton onClick={() => console.log('Atualizar')}>
              <CachedIcon />
            </IconButton>
            <SelectEnv
              envOptions={envOptions}
              handleEnv={setSelectedEnv}
              selectedEnv={selectedEnv}
            />
            <Chip
              icon={<GitHub style={{ fontSize: 18, marginLeft: '10px' }} />}
              label='Github'
              size='medium'
              variant='outlined'
              onClick={handleOpenGithub}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
