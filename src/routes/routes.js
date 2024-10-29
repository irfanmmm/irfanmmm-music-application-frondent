import Favorate from '../screens/Favorate';
import Home from '../screens/Home';
import PlayerScreen from '../screens/PlayerScreen';

export const TABS_ROUTES = [
    {
      route: 'Home',
      component: Home,
      active: require('../img/home_active.png'),
      diactivate: require('../img/home.png'),
    },
    {
      route: 'MusicPlayer',
      component: PlayerScreen,
      active: require('../img/headphone_active.png'),
      diactivate: require('../img/headphone.png'),
    },
    {
      route: 'Favorate',
      component: Favorate,
      active: require('../img/heartactive.png'),
      diactivate: require('../img/heart.png'),
    },
  ];