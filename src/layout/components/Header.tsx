import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export function Header() {
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
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Serveruler
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
