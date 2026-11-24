'use strict';

const audiences = {
  school: {tag: 'Ortaokul & lise', title: 'Derslerin bir adım daha anlaşılır olsun.', description: 'Sınıfına uygun konu föyleriyle öğren, çözümlü örneklerle pekiştir. Kolay, normal ve zor testlerle kendini dene; arkadaşlarınla notlarını paylaş.', features: ['Konu anlatım föyleri ve örnek çözümler', 'Seviyene uygun testler ve sonuç takibi', 'Çalışma odaları, görevler ve rozetler'], artLabel: 'ÖĞRENME YOLCULUĞUM', artTitle: 'Bir konuyu daha birlikte aşalım.', artList: ['Konuyu keşfet', 'Kendini dene', 'Bildiğini paylaş']},
  exam: {tag: 'Sınava hazırlık', title: 'Hedefin belli. Yolunu birlikte planlayalım.', description: 'LGS, TYT, YKS veya dil sınavına hazırlanırken sınavına uygun dersleri keşfet. Hazır föylerle tekrar et, soru bankasında farklı sorularla pratik yap.', features: ['Hazırlandığın sınava uygun ders ve konular', 'Konu testleri ve ayrı soru bankası', 'Doğru-yanlış, çalışma ve ilerleme takibi'], artLabel: 'HEDEFİME DOĞRU', artTitle: 'Her tekrar, bir adım daha.', artList: ['Hedefini seç', 'Konuları pekiştir', 'Sorularla ilerle']},
  campus: {tag: 'Üniversite', title: 'Kampüs hayatına bir bağlantı daha.', description: 'Üniversitendeki insanlarla tanış. Bölümüne ve üniversitene ait kulüpleri keşfet, ders notlarını paylaş; duyurulara ve akademik takvimlere göz at.', features: ['Üniversite ve bölüm odaklı kulüpler', 'PDF ve Word formatında not paylaşımı', 'Üniversite duyuruları ve ilgi alanı haberleri'], artLabel: 'BENİM KAMPÜSÜM', artTitle: 'Aynı kampüs, yeni bağlantılar.', artList: ['Kulüpleri keşfet', 'Notlarını paylaş', 'Gündemi takip et']},
  teacher: {tag: 'Öğretmen', title: 'Bilgin, sınıfınla daha kolay buluşsun.', description: 'Ders verdiğin sınıf ve şubeleri seç. Notlarını ve konu anlatımlarını ilgili öğrencilerle paylaş; çalışma odalarında öğrenmeye rehberlik et.', features: ['Birden fazla sınıf ve şube seçimi', 'Seçilen şubelere özel eğitim paylaşımları', 'Çalışma odaları, okul ve eğitim gündemi'], artLabel: 'BİRLİKTE ÖĞRENİYORUZ', artTitle: 'Bir sınıftan daha fazlası.', artList: ['Şubelerini seç', 'Bilgini paylaş', 'Öğrenmeye rehber ol']}
};

const tabs = [...document.querySelectorAll('[data-audience]')];
function selectAudience(tab) {
  const item = audiences[tab.dataset.audience];
  tabs.forEach(button => { const selected = button === tab; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
  document.getElementById('audience-panel').setAttribute('aria-labelledby', tab.id);
  for (const [id, value] of [['audience-tag', item.tag], ['audience-title', item.title], ['audience-description', item.description], ['art-label', item.artLabel], ['art-title', item.artTitle]]) document.getElementById(id).textContent = value;
  const list = document.getElementById('audience-features');
  list.replaceChildren(...item.features.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  document.getElementById('art-list').replaceChildren(...item.artList.map(text => { const span = document.createElement('span'); span.textContent = '✓ ' + text; return span; }));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectAudience(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[next].focus(); selectAudience(tabs[next]);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation-links');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Menüyü aç'); }
menuButton.addEventListener('click', () => { const opened = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(opened)); menuButton.setAttribute('aria-label', opened ? 'Menüyü kapat' : 'Menüyü aç'); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.navigation')) closeMenu(); });

const screenCards = [...document.querySelectorAll('[data-screen]')];
const dialog = document.getElementById('screen-dialog');
let currentScreen = 0;
function showScreen(index) {
  currentScreen = (index + screenCards.length) % screenCards.length;
  const card = screenCards[currentScreen];
  document.getElementById('dialog-title').textContent = card.dataset.title;
  document.getElementById('dialog-caption').textContent = card.dataset.caption;
  const image = document.getElementById('dialog-image'); image.src = card.dataset.screen; image.alt = card.querySelector('h3').textContent + ' — Knowchain ekran görüntüsü';
  dialog.querySelector('.dialog-count').textContent = (currentScreen + 1) + ' / ' + screenCards.length;
  dialog.querySelector('.dialog-image').scrollTop = 0;
}
screenCards.forEach((card, index) => card.addEventListener('click', () => { showScreen(index); dialog.showModal(); }));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
document.getElementById('previous-screen').addEventListener('click', () => showScreen(currentScreen - 1));
document.getElementById('next-screen').addEventListener('click', () => showScreen(currentScreen + 1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); showScreen(currentScreen + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); showScreen(currentScreen - 1); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
dialog.addEventListener('toggle', () => { document.body.style.overflow = dialog.open ? 'hidden' : ''; });

const steps = [...document.querySelectorAll('.steps details')];
steps.forEach(step => step.addEventListener('toggle', () => { if (step.open) steps.forEach(other => { if (other !== step) other.open = false; }); }));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, {threshold: .08});
  document.querySelectorAll('.section-intro, .feature-heading, .audience-panel, .mission-grid, .join-inner').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}
