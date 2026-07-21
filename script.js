const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
  });
}

const communeNames = {
  sorbs: 'Sorbs',
  caylar: 'Le Caylar',
  rives: 'Les Rives',
  cros: 'Le Cros',
  saintmaurice: 'Saint-Maurice-Navacelles',
  pegairolles: 'Pégairolles-de-l’Escalette',
  vacquerie: 'La Vacquerie-et-Saint-Martin',
  saintfelix: 'Saint-Félix-de-l’Héras'
};

document.querySelectorAll('.commune').forEach(shape => {
  shape.addEventListener('click', () => {
    document.querySelectorAll('.commune').forEach(el => el.classList.remove('is-active'));
    shape.classList.add('is-active');
    const name = communeNames[shape.dataset.commune];
    const nameTarget = document.querySelector('#map-name');
    if (name && nameTarget) nameTarget.textContent = name;
  });
});
