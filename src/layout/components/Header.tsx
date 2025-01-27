import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Chip, Stack } from "@mui/material";
import GitHub from "@mui/icons-material/GitHub";
import { useUserData } from '../../hooks/useIps'
import { SelectEnv } from './SelectEnv'



export function Header() {
  const { envOptions, selectedEnv, setSelectedEnv } = useUserData();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters style={{ minHeight: 60 }}>
          <img
            src="https://i.imgur.com/EXY2Msb.png"
            height={30}
            style={{ marginRight: 14 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="p"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
            }}
          >
            Serveruler
          </Typography>
          <Stack direction='row' alignItems='center' spacing={1}>
            <SelectEnv
              envOptions={envOptions}
              handleEnv={setSelectedEnv}
              selectedEnv={selectedEnv}
            />
          <Chip
            icon={<GitHub style={{ fontSize: 14, marginLeft: "6px" }} />}
            label="Github"
            size="small"
            variant="outlined"
            onClick={() => openGithub()}
            />
            </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const openGithub = () => {
  window.open("https://github.com/joaolfern/serveruler-client", "_blank");
};
