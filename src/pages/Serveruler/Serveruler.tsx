import { Box, Grid } from '@mui/material'
import { useUserData } from '../../hooks/useIps'
import { UserCard } from './components/UserCard/UserCard'

export default function Serveruler() {
  const { data, selectedEnv } = useUserData()

  return (
    <Box sx={{ pt: 2 }}>
      <Grid container gap={2}>
        {Object.entries(data).map(([user, userData]) => {
          const address = userData[selectedEnv]
          if (!address) return
          return (
            <Grid key={user + selectedEnv}>
              <UserCard address={address} user={user} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
