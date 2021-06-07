import { Box, Grommet, Header, Heading, Main } from "grommet"
import PurchasesList from "./components/PurchasesList"

const App = () => {
  return (
    <Grommet>
      <Box align="center">
        <Header>
          <Heading>Purchases</Heading>
        </Header>
        <Main>
          <PurchasesList />
        </Main>
      </Box>
    </Grommet>
  )
}

export default App
