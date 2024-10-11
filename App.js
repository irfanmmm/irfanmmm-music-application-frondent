import React from 'react';
import {Provider} from 'react-redux';
import store from './src/config/redux/store';
import StackNavigator from './src/routes/StackNavigator';
const App = () => {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};
export default App;
