import {
  Alert,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { SERVER_OPTIONS } from '../../../../constants'
import { copyToClipboard } from '../../../../utils/copyToClipboard'
import { getCompleteAddress } from '../../../../utils/getCompleteAddress'
import { getIsOnline } from '../../../../utils/getIsOnline'
import { ServerChip } from '../ServerChip/ServerChip'

interface IUserProps {
  address: string
  user: string
}

export const UserCard = memo(function UserCard({ address, user }: IUserProps) {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [chipVariants, setChipVariants] = useState<
    Record<string, 'filled' | 'outlined'>
  >({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const updateItemLoading = useCallback((item: string, loading: boolean) => {
    setIsLoading((prev) => ({
      ...prev,
      [item]: loading,
    }))
  }, [])

  const updateItemStatus = useCallback((item: string, online: boolean) => {
    setStatus((prev) => ({
      ...prev,
      [item]: online,
    }))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function updateStatus() {
      const isOnlineByAddress = await getIsOnline({
        address,
        updateItemLoading,
        updateItemStatus,
      })
      if (!cancelled) {
        setStatus(isOnlineByAddress)
      }
    }
    updateStatus()
    return () => {
      cancelled = true
    }
  }, [address, updateItemLoading, updateItemStatus])

  const copy = useCallback(
    (selectedServer?: string) => {
      if (!selectedServer) {
        copyToClipboard(address)
        setSnackbarOpen(true)
        return
      }

      const ip = getCompleteAddress(address, selectedServer)
      const formattedIp = Array.isArray(ip) ? ip.join(', ') : ip
      copyToClipboard(formattedIp)
      setSnackbarOpen(true)
    },
    [address]
  )

  const handleVariant = useCallback((label: string, isFilled: boolean) => {
    setChipVariants((prev) => ({
      ...prev,
      [label]: isFilled ? 'filled' : 'outlined',
    }))
  }, [])

  const statusByPort = useMemo(() => {
    const result: Record<string, boolean> = {}
    Object.entries(status).forEach(([addr, online]) => {
      const port = addr.split(':').pop()
      if (port) result[port] = online
    })
    return result
  }, [status])

  const username = USERNAMES[user]
  const profileImage = username && `https://github.com/${username}.png`

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={750}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success' sx={{ width: '100%' }}>
          Endereço de IP copiado com sucesso!
        </Alert>
      </Snackbar>

      <Card sx={{ maxWidth: 275, pb: 1 }}>
        <CardContent>
          <Stack
            direction='row'
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction='row' spacing={1} alignItems='center'>
              <Avatar src={profileImage} sx={{ width: 24, height: 24 }} />
              <Typography>{user}</Typography>
            </Stack>
            <Typography onClick={() => copy()} sx={{ cursor: 'pointer' }}>
              {address}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions style={{ paddingTop: 0 }}>
          <Grid
            container
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              gridAutoColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 1,
            }}
          >
            {SERVER_OPTIONS.map(({ label, value: port }) => (
              <ServerChip
                key={label}
                port={port}
                label={label}
                isItemLoading={isLoading[`http://${address}:${port}`]}
                status={statusByPort[port]}
                variant={chipVariants[label]}
                handleVariant={handleVariant}
                copy={copy}
              />
            ))}
          </Grid>
        </CardActions>
      </Card>
    </>
  )
})

const USERNAMES: Record<string, string> = {
  joao: 'joaolfern',
  carlos: 'JoaoCarlosP',
  vieira: 'RafaelHDSV',
  fernanda: 'mfernandanll',
  bruno: 'BrunoPasqual',
  lucas: 'lucasrbordignon',
  tobias: 'tobiasperassi',
  zarco: 'felipezarco',
  danieli: 'Danieli01',
  davi: 'DaviSanttos',
  marcus: 'marcuslaraa',
  mateus: 'Al-Esmarfe',
  robson: 'RobsonArita',
  michael: 'MichaelDouglasLima',
  diego: 'odiegoalessandro',
  janderson: 'JandersonSR',
  nicolas: 'Nicolaskn95',
  thales: 'thalesmanoel',
  ana: 'anamrcnds',
  andre: 'AndreLuizJPoles',
  vinicius: 'ViniciusRibeiro6',
}
