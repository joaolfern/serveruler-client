import Container from '@mui/material/Container'
import { ReactNode } from 'react'
import { Header } from './components/Header'

interface ILayoutProps {
  children: ReactNode
}

export function Layout({ children }: ILayoutProps) {
  return (
    <Container disableGutters maxWidth={false}>
      <Header />
      <Container sx={{ paddingBlock: 2 }}>{children}</Container>
    </Container>
  )
}
