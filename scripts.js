// ---------- Navigation entre les pages ----------
const pageHome = document.getElementById('page-home');
const pageSignup = document.getElementById('page-signup');
const pageBook = document.getElementById('page-book');

// Liens du menu
document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  show('home');
});

document.getElementById('nav-signup').addEventListener('click', (e) => {
  e.preventDefault();
  show('signup');
});

document.getElementById('nav-book').addEventListener('click', (e) => {
  e.preventDefault();
  show('book');
});

// Boutons d’action sur la page d’accueil
const heroSignup = document.getElementById('hero-signup');
const heroBook = document.getElementById('hero-book');
if (heroSignup) heroSignup.addEventListener('click', () => show('signup'));
if (heroBook) heroBook.addEventListener('click', () => show('book'));

// Bouton retour
const backHome = document.getElementById('back-home-1');
if (backHome) backHome.addEventListener('click', (e) => {
  e.preventDefault();
  show('home');
});

// Fonction d’affichage des pages
function show(page) {
  pageHome.classList.add('hidden');
  pageSignup.classList.add('hidden');
  pageBook.classList.add('hidden');

  if (page === 'home') pageHome.classList.remove('hidden');
  if (page === 'signup') pageSignup.classList.remove('hidden');
  if (page === 'book') pageBook.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Initialisation ----------
document.addEventListener('DOMContentLoaded', () => {
  show('home');
  populateDates();
  initMultiselects();
});


// ---------- Dates disponibles ----------
function getNextAvailableDates(weeks = 8) {
  const allowed = [3, 6, 0]; // mercredi, samedi, dimanche
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + weeks * 7);
  const arr = [];

  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    if (allowed.includes(d.getDay())) {
      arr.push({
        val: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });
    }
  }
  return arr;
}

function populateDates() {
  const dinner = document.getElementById('dinnerDate');
  const quick = document.getElementById('quickDate');
  if (!dinner || !quick) return;

  const dates = getNextAvailableDates();
  dinner.innerHTML = '<option value="">— Choisis une date —</option>';
  quick.innerHTML = '<option value="">— Choisis une date —</option>';

  dates.forEach(d => {
    const o = document.createElement('option');
    o.value = d.val;
    o.textContent = d.label;
    dinner.appendChild(o);
    const q = o.cloneNode(true);
    quick.appendChild(q);
  });
}

function prefillQuick() {
  const val = document.getElementById('quickDate').value;
  if (!val) return alert('Choisis une date');
  show('signup');
  setTimeout(() => document.getElementById('dinnerDate').value = val, 200);
}


// ---------- MultiSelect : personnalité & passions ----------
function initMultiselects() {
  const personalityOptions = [
    "Sociable","Calme","Curieux","Créatif","Empathique","Réfléchi","Ambitieux","Spontané",
    "Leader","Introverti","Aventurier","Patient","Optimiste","Rigoureux","Altruiste","Drôle",
    "Observateur","Déterminé","Rêveur","Pragmatique","Diplomate","Charismatique","Persévérant",
    "Dynamique","Organisé","Sincère","Discret","Motivé","Attentif","Passionné","Fiable",
    "Loyal","Innovant","Responsable","Esprit d'équipe","Visionnaire","Tolérant","Modeste","Indépendant",
    "Exigeant","Consciencieux","Audacieux","Réaliste"
  ];

  const passionsOptions = [
    "Cuisine","Voyage","Lecture","Cinéma","Sport","Musique","Art","Technologie","Entrepreneuriat",
    "Mode","Écologie","Volontariat","Photographie","Développement personnel","Santé & bien-être",
    "Sciences","Histoire","Langues","Nature","Spiritualité","Danse","Événementiel","Écriture",
    "Politique","Design","Théâtre","Podcast","Jeux vidéo","Innovation","Environnement","Finance",
    "Philosophie","Animation","Architecture","Jardinage","Culture africaine","Relations humaines",
    "Médecine","Éducation","Mode de vie durable","Astronomie","Débat","Animaux","Poésie","Coaching",
    "Voyage humanitaire","Startups","Médias","Communication","Marketing digital"
  ];

  createDropdownMultiselect('personalitySelect', personalityOptions, 'Personnalite(mots-clés)');
  createDropdownMultiselect('passionsSelect', passionsOptions, 'Passions');
}


function createDropdownMultiselect(containerId, optionsArray, inputName, minSel = 3, maxSel = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const toggle = container.querySelector('.multiselect-toggle');
  const panel = container.querySelector('.multiselect-panel');
  const chipsWrap = container.querySelector('.chips');

  // Créer les options cochables
  panel.innerHTML = '';
  optionsArray.forEach(opt => {
    const option = document.createElement('label');
    option.className = 'dropdown-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = opt;
    checkbox.style.marginRight = '8px';
    const span = document.createElement('span');
    span.textContent = opt;
    option.appendChild(checkbox);
    option.appendChild(span);
    panel.appendChild(option);

    // Gestion du clic
    checkbox.addEventListener('change', () => {
      const selected = Array.from(panel.querySelectorAll('input:checked')).map(x => x.value);
      if (selected.length > maxSel) {
        checkbox.checked = false;
        alert(`⚠️ Tu peux choisir au maximum ${maxSel} options.`);
        return;
      }
      updateDisplay(selected);
    });
  });

  // Affichage des choix sous forme de tags
  function updateDisplay(values) {
    chipsWrap.innerHTML = '';
    if (values.length === 0) {
      chipsWrap.innerHTML = `<span style="color:#aaa;font-size:13px">${chipsWrap.dataset.placeholder || 'Choisis...'}</span>`;
    } else {
      values.forEach(v => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = v;
        chipsWrap.appendChild(chip);
      });
    }

    // Met à jour les inputs cachés pour l'envoi du formulaire
    container.querySelectorAll(`input[name="${inputName}"]`).forEach(n => n.remove());
    values.forEach(v => {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = inputName;
      hidden.value = v;
      container.appendChild(hidden);
    });
  }

  // Ouverture/fermeture du menu déroulant
  function togglePanel() {
    panel.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', !panel.classList.contains('hidden'));
  }

  toggle.addEventListener('click', togglePanel);
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) panel.classList.add('hidden');
  });
}


// ---------- Gestion du formulaire ----------
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const pers = form.querySelectorAll('input[name="Personnalite(mots-clés)"]');
  const pass = form.querySelectorAll('input[name="Passions"]');

  if (pers.length < 3 || pers.length > 5) return alert('Choisis entre 3 et 5 traits de personnalité.');
  if (pass.length < 3 || pass.length > 5) return alert('Choisis entre 3 et 5 passions.');

  const fd = new FormData(form);
  fd.append('Note', "Après réception, l'équipe te contactera pour le paiement.");

  try {
    await fetch(form.action, { method: 'POST', body: fd });
    form.classList.add('hidden');
    const msg = document.getElementById('submitMessage');
    msg.classList.remove('hidden');
    msg.innerHTML = `<h3>✅ Inscription envoyée</h3>
      <p>Merci ! Ton profil a bien été envoyé. Tu recevras bientôt un e-mail de confirmation avec les informations pour finaliser ta participation.</p>
      <p><strong>Important :</strong> Pour confirmer ta place, règle la somme demandée par Mobile Money ou virement bancaire, puis envoie la preuve de paiement à <a href="mailto:ahmedicare13@gmail.com">ahmedicare13@gmail.com</a>.</p>`;
  } catch {
    alert("⚠️ Erreur d'envoi. Essaie à nouveau ou contacte-nous par mail.");
  }
}


// ---------- Retour à l'accueil ----------
function goHome() {
  show('home');
}
