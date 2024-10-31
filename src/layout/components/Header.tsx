import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Chip, } from '@mui/material'
import GitHub from '@mui/icons-material/GitHub';
export function Header() {

  const openGithub = () => {
    window.open('https://github.com/joaolfern/serveruler-client', '_blank');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <img
            src="https://i.imgur.com/EXY2Msb.png"
            height={40}
            width={40}
            style={{ marginRight: 14 }}
          />
          <Typography
            variant="h5"
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
          <Chip icon={<GitHub  style={{ fontSize: 14, marginLeft: '6px'}} />} label="Github" size='small' variant="outlined"  onClick={() => openGithub()}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
