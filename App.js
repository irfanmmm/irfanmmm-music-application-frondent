import React from "react"
import Root from "./src/screens/Root"
import { ThemeProvider } from "./src/rootstate/ContextApi"
import { Provider } from "react-redux"
import store from "./src/config/redux/store"
const App = () => {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}
export default App