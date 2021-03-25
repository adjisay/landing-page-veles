function burger(triggerSelector, menuSelector, activeClass) {
  const button = document.querySelector(triggerSelector),
        menu = document.querySelector(menuSelector),
        body = document.querySelector('body');

  button.addEventListener('click', (e) => {
    const target = e.target;

    if (target && menu.classList.contains(activeClass)) {
      menu.classList.remove(activeClass);
      body.style.overflow = '';
    } else {
      menu.classList.add(activeClass);
      body.style.overflow = 'hidden';
    }
  });
}

export default burger;