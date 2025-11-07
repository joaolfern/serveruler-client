import { Chip, Skeleton } from '@mui/material'
import { memo } from 'react'

interface ServerChipProps {
  port: string
  label: string
  variant: 'filled' | 'outlined'
  status: boolean
  isItemLoading: boolean
  handleVariant: (label: string, isFilled: boolean) => void
  copy: (value: string) => void
}

export const ServerChip = memo(function ServerChip({
  port,
  status,
  label,
  variant,
  isItemLoading,
  handleVariant,
  copy,
}: ServerChipProps) {
  const formattedLabel = variant === 'filled' ? port : label
  const currentConnectionStatus = status
  return (
    <LoadingWrapper key={label} loading={isItemLoading}>
      <Chip
        label={formattedLabel}
        variant={variant || 'outlined'}
        color={currentConnectionStatus ? 'success' : 'error'}
        onClick={() => copy(port)}
        onMouseEnter={() => handleVariant(label, true)}
        onMouseLeave={() => handleVariant(label, false)}
        sx={{
          width: '100%',
          maxWidth: 120,
        }}
      />
    </LoadingWrapper>
  )
})

function LoadingWrapper({
  loading,
  children,
}: {
  loading: boolean
  children: React.ReactNode
}) {
  if (loading) {
    return (
      <Skeleton
        variant='rectangular'
        width={120}
        height={32}
        sx={{ borderRadius: 16 }}
      />
    )
  }
  return children
}
