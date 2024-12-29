import { Box, MenuItem, Select, Stack } from '@mui/material'
import Computer from "@mui/icons-material/Computer";

interface ISelectEnvProps {
  selectedEnv: string
  handleEnv: (env: string) => void
  envOptions: string[]
}

export function SelectEnv ({ envOptions, handleEnv, selectedEnv }: ISelectEnvProps) {
  return (
    <Stack
      direction='row'
      spacing={1}
    >
      <Select
        sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
        disableUnderline={true}
        key={selectedEnv}
        size='small'
        value={selectedEnv}
        onChange={(e) => handleEnv(e.target.value)}
        defaultValue={selectedEnv}
        renderValue={(value) => {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Computer />
              {value}
            </Box>
          );
        }}
      >
        {envOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </Stack>

  )
}