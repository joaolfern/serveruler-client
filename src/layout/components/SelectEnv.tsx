import Business from '@mui/icons-material/Business'
import Home from '@mui/icons-material/Home'
import Public from '@mui/icons-material/Public'
import Smartphone from '@mui/icons-material/Smartphone'
import { Box, MenuItem, Select, Stack } from '@mui/material'
import { useUserData } from '../../hooks/useIps'

export function SelectEnv() {
  const { envOptions, selectedEnv, setSelectedEnv } = useUserData()

  return (
    <Stack direction='row' spacing={1}>
      <Select
        sx={{
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': { border: 0 }
        }}
        key={selectedEnv}
        size='small'
        value={selectedEnv}
        onChange={(e) => setSelectedEnv(e.target.value)}
        renderValue={(option) => <Item option={option} />}
      >
        {envOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Item option={option} />
          </MenuItem>
        ))}
      </Select>
    </Stack>
  )
}

function Item({ option }: { option: string }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'empresa':
        return <Business />
      case 'externalEmpresa':
        return <Public />
      case 'casa':
        return <Home />
      case 'celular':
        return <Smartphone />
      default:
        return null
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {getIcon(option)}
      {option}
    </Box>
  )
}
