const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
  });
}

const mapData = {
  sorbs: { name: 'Sorbs', species: 18, roosts: 6, bats: 74, effort: '8 nuits acoustiques' },
  caylar: { name: 'Le Caylar', species: 21, roosts: 9, bats: 132, effort: '14 nuits acoustiques' },
  rives: { name: 'Les Rives', species: 16, roosts: 4, bats: 48, effort: '6 nuits acoustiques' },
  cros: { name: 'Le Cros', species: 14, roosts: 3, bats: 31, effort: '5 nuits acoustiques' },
  saintmaurice: { name: 'Saint-Maurice-Navacelles', species: 22, roosts: 11, bats: 184, effort: '16 nuits acoustiques' },
  pegairolles: { name: 'Pégairolles-de-l’Escalette', species: 19, roosts: 8, bats: 96, effort: '10 nuits acoustiques' },
  vacquerie: { name: 'La Vacquerie-et-Saint-Martin', species: 20, roosts: 7, bats: 118, effort: '12 nuits acoustiques' },
  saintfelix: { name: 'Saint-Félix-de-l’Héras', species: 15, roosts: 5, bats: 56, effort: '7 nuits acoustiques' }
};

document.querySelectorAll('.commune').forEach(shape => {
  shape.addEventListener('click', () => {
    document.querySelectorAll('.commune').forEach(el => el.classList.remove('is-active'));
    shape.classList.add('is-active');
    const d = mapData[shape.dataset.commune];
    if (!d) return;
    document.querySelector('#map-name').textContent = d.name;
    document.querySelector('#map-species').textContent = d.species;
    document.querySelector('#map-roosts').textContent = d.roosts;
    document.querySelector('#map-bats').textContent = d.bats;
    document.querySelector('#map-effort').textContent = d.effort;
  });
});
