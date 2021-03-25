import burger from './modules/burger';
import slider from './modules/slider';

window.addEventListener('DOMContentLoaded', () => {
  slider();
  burger('.navigation__burger', '.navigation__main-menu', 'navigation__main-menu--active');
}); 