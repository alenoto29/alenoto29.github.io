// Every record below is generated from invented names and reserved .invalid domains.
const names = [
  'Mira Valen','Tomas Belvi','Elia Sorel','Nora Castin','Luca Verri','Ada Mirel','Ruben Salvo','Celia Brant',
  'Ines Maren','Dario Levan','Sara Navel','Enzo Cauri','Lina Velas','Pablo Miret','Noa Ferrin','Alma Roval',
  'Léa Savrel','Hugo Darin','Camille Verot','Rémi Auvin','Maëlle Corin','Jules Lavet','Anaïs Breval','Théo Marot',
  'Iris Wexley','Owen Marlowe','Freya Belton','Miles Arden','Nell Carver','Theo Elwick','Ava Renshaw','Eli Fenwick',
  'Marta Vilar','João Serrin','Inês Calvo','Tiago Merval','Lara Montez','Nuno Varela','Eva Barros','Rui Celar'
];
const markets = ['IT','ES','FR','UK','PT'];
const publishers = [
  ['The Green Ledger','green-ledger.invalid',78,'national'],['Signal & Soil','signal-soil.invalid',64,'specialist'],
  ['The Energy Desk','energy-desk.invalid',71,'national'],['Civic Current','civic-current.invalid',52,'regional'],
  ['Tomorrow Review','tomorrow-review.invalid',83,'national'],['Policy & Planet','policy-planet.invalid',67,'specialist'],
  ['The City Brief','city-brief.invalid',45,'regional'],['New Ground Journal','new-ground.invalid',59,'specialist']
];
const topics = ['Energy','Climate','Housing','Transport','Technology','Consumer affairs','Environment','Public policy'];
const roles = ['Reporter','Correspondent','Features writer','Editor'];
const emailStatuses = ['Synthetic address','Synthetic address','Synthetic address','Needs review'];
const responseStatuses = ['Pitch drafted','Answered','No response'];
const priorities = ['High','Medium','Low'];
const profiles = names.map((name, index) => {
  const publisher = publishers[index % publishers.length];
  const topic = topics[(index * 3) % topics.length];
  const market = markets[Math.floor(index / 8)];
  const [firstName, ...lastParts] = name.split(' ');
  const lastName = lastParts.join(' ');
  const contactCount = index % 5;
  return {
    id: `SYN-${String(index + 1).padStart(3, '0')}`, firstName, lastName,
    jobTitle: roles[index % roles.length], publisher: publisher[0], domain: publisher[1],
    dr: publisher[2], publisherScope: publisher[3], market, mainTopic: topic,
    email: `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@${publisher[1]}`,
    emailType: 'synthetic personal address', emailStatus: emailStatuses[index % emailStatuses.length],
    responseStatus: contactCount ? responseStatuses[index % responseStatuses.length] : 'Not contacted',
    linkedin: `https://social.example.invalid/${index + 1} (fictional, inactive)`,
    authorPage: `https://${publisher[1]}/authors/${index + 1} (fictional, inactive)`,
    lastContacted: contactCount ? `2026-0${(index % 8) + 1}-1${index % 9} (invented)` : 'Not contacted',
    priority: priorities[index % priorities.length], reportsCount: contactCount ? index % 3 : 0,
    contactCount,
    notes: `Fictional ${market} profile for demonstrating coverage and contact review. Verify a real journalist’s beat and publication before any outreach.`,
    article: `Illustrative article: “A new look at ${topic.toLowerCase()}” (invented; no source URL)`
  };
});
const labels = [
  ['id','Demo ID'],['firstName','First name'],['lastName','Last name'],['jobTitle','Job title'],
  ['publisher','Publisher'],['domain','Publisher domain'],['dr','Illustrative DR'],['publisherScope','Publisher scope'],
  ['market','Market'],['mainTopic','Main topic'],['email','Synthetic email'],['emailType','Email type'],
  ['emailStatus','Email status'],['responseStatus','Response status'],['linkedin','LinkedIn'],['authorPage','Author page'],
  ['lastContacted','Last contacted'],['priority','Priority'],['reportsCount','Reports count'],['contactCount','Contact count'],
  ['article','Coverage example'],['notes','Notes']
];
const list = document.querySelector('#list');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
const search = document.querySelector('#search');
const market = document.querySelector('#market');
const topic = document.querySelector('#topic');
let selectedId = profiles[0].id;
for (const value of topics) topic.add(new Option(value, value));

function showProfile(profile) {
  selectedId = profile.id;
  document.querySelector('#profile-name').textContent = `${profile.firstName} ${profile.lastName}`;
  document.querySelector('#profile-index').textContent = `${profile.id} / FICTIONAL`;
  document.querySelector('#profile-summary').textContent = `${profile.jobTitle} covering ${profile.mainTopic.toLowerCase()} in ${profile.market}. This profile is invented for interface review.`;
  const fields = document.querySelector('#profile-fields');
  fields.replaceChildren();
  for (const [key, label] of labels) {
    const row = document.createElement('div');
    if (key === 'notes' || key === 'article') row.className = 'wide';
    const term = document.createElement('dt');
    term.textContent = label;
    const value = document.createElement('dd');
    value.textContent = String(profile[key]);
    row.append(term, value);
    fields.append(row);
  }
  for (const button of list.querySelectorAll('button')) button.setAttribute('aria-current', String(button.dataset.id === selectedId));
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtered = profiles.filter(profile =>
    (!market.value || profile.market === market.value) &&
    (!topic.value || profile.mainTopic === topic.value) &&
    (!query || [profile.firstName, profile.lastName, profile.publisher, profile.mainTopic, profile.jobTitle].join(' ').toLocaleLowerCase().includes(query))
  );
  count.textContent = String(filtered.length);
  empty.hidden = filtered.length > 0;
  list.replaceChildren();
  for (const profile of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'contact';
    button.dataset.id = profile.id;
    button.setAttribute('aria-current', String(profile.id === selectedId));
    const person = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = `${profile.firstName} ${profile.lastName}`;
    const beat = document.createElement('small');
    beat.textContent = `${profile.market} · ${profile.mainTopic}`;
    person.append(name, beat);
    const outlet = document.createElement('span');
    outlet.textContent = profile.publisher;
    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = profile.responseStatus;
    button.append(person, outlet, status);
    button.addEventListener('click', () => showProfile(profile));
    list.append(button);
  }
}
for (const control of [search, market, topic]) control.addEventListener(control === search ? 'input' : 'change', render);
showProfile(profiles[0]);
render();

const directoryTab = document.querySelector('#directory-tab');
const kpiTab = document.querySelector('#kpi-tab');
function showView(name) {
  const isKpi = name === 'kpi';
  document.querySelector('#directory-view').hidden = isKpi;
  document.querySelector('#kpi-view').hidden = !isKpi;
  directoryTab.classList.toggle('active', !isKpi);
  kpiTab.classList.toggle('active', isKpi);
  if (isKpi) { kpiTab.setAttribute('aria-current', 'page'); directoryTab.removeAttribute('aria-current'); }
  else { directoryTab.setAttribute('aria-current', 'page'); kpiTab.removeAttribute('aria-current'); }
}
directoryTab.addEventListener('click', () => showView('directory'));
kpiTab.addEventListener('click', () => showView('kpi'));

const snapshots = [
  ['June', 10, 1], ['July', 20, 2], ['August', 30, 3], ['September', 40, 4]
].map(([month, size, campaigns]) => {
  const subset = profiles.slice(0, size);
  return { month, journalists: size, publishers: new Set(subset.map(p => p.publisher)).size,
    contacted: subset.filter(p => p.contactCount > 0).length,
    withReports: subset.filter(p => p.reportsCount > 0).length, campaigns };
});
const latest = snapshots.at(-1);
for (const [label, value, note] of [
  ['Journalists', latest.journalists, 'synthetic profiles'],
  ['Publishers', latest.publishers, 'fictional outlets'],
  ['Contacted', latest.contacted, 'invented history'],
  ['With reports', latest.withReports, 'invented history'],
  ['Campaigns', latest.campaigns, 'illustrative count']
]) {
  const card = document.createElement('div');
  card.innerHTML = `<span>${label}</span><strong>${value}</strong><small>${note}</small>`;
  document.querySelector('#kpi-cards').append(card);
}
for (const item of snapshots) {
  const row = document.createElement('tr');
  for (const value of [item.month, item.journalists, item.publishers, item.contacted, item.withReports, item.campaigns]) {
    const cell = document.createElement(row.children.length ? 'td' : 'th');
    if (!row.children.length) cell.scope = 'row';
    cell.textContent = String(value);
    row.append(cell);
  }
  document.querySelector('#history-rows').append(row);
  const bar = document.createElement('div');
  bar.className = 'history-bar';
  const label = document.createElement('span');
  label.textContent = item.month;
  const track = document.createElement('div');
  track.className = 'bar-track';
  const fill = document.createElement('span');
  fill.style.width = `${item.journalists / 40 * 100}%`;
  track.append(fill);
  const value = document.createElement('strong');
  value.textContent = `${item.journalists} profiles · ${item.contacted} contacted`;
  bar.append(label, track, value);
  document.querySelector('#history-bars').append(bar);
}
