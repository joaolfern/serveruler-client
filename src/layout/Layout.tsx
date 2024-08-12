import { ReactNode } from "react";
import Container from "@mui/material/Container";
import { Header } from "./components/Header";

interface ILayoutProps {
  children: ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  return (
    <Container disableGutters maxWidth={false}>
      <Header />
      <Container maxWidth="sm" sx={{ paddingBlock: 2 }}>
        {children}
      </Container>
    </Container>
  );
}
