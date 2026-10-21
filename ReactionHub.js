"use strict";

// Curated X accounts. Keep this list short and review handles periodically.
const COLLECTIONS = {
  stan: ["TheMemesArchive", "memebiblee", "allreactionvids", "findurmeme", "gay_reactions", "dlipameme", "findurvideo", "Ajayreactions", "acervoqueen", "azealiareacts", "GabbieReaction", "miriamsedit", "ajayiivids", "crack_cloud", "imbabyvids", "ReactionVideos_", "reactvideoos", "VideosFolder", "dustbin_nie"],
  italian: ["elenoire_video", "OutFacchetti", "oocisola", "oocgfvip5", "follettinaooc", "_niguarda", "OutChiara", "nzvatooc", "BotElenoire", "giussarchive", "falizzovid", "oocgfvip", "memevari", "s_medi4", "emanuelabot1", "ItaReaction", "giorgymemes"],
  kpop: ["videonct", "dustbin_nie", "GOT7reactvids", "svtreaction", "chunghareaction", "kpreactionvids", "kpopreactionss", "KpopFancams6", "kpopthins", "fancamie", "multifancams", "kjongincams", "chaelinfancam", "svtfancams", "bangtanfancam", "eternaIsbts", "BTSARMY_fancam", "uhbtscam", "KFiles4u"]
};
const STORAGE_KEY = "reactionhub.v2";
const MAX_CUSTOM = 60;

function normalizeAccounts(accounts) {
  const seen = new Set();
  return accounts.map(value => String(value).trim().replace(/^@/, ""))
    .filter(value => {
      if (!/^[A-Za-z0-9_]{1,15}$/.test(value)) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function createQuery(keyword, accounts, mediaFilter = "media", exact = false) {
  const term = String(keyword).trim().replace(/\s+/g, " ");
  const phrase = exact && term ? '"' + term.replace(/"/g, "") + '"' : term;
  const handles = normalizeAccounts(accounts);
  const authors = handles.length ? "(" + handles.map(h => "from:" + h).join(" OR ") + ")" : "";
  const filter = mediaFilter === "videos" ? "filter:videos" : mediaFilter === "images" ? "filter:images" : "filter:media";
  return [phrase, authors, filter].filter(Boolean).join(" ");
}

function createURL(query, view = "media") {
  return "https://x.com/search?q=" + encodeURIComponent(query) + "&f=" + (view === "live" ? "live" : view === "top" ? "top" : "media");
}

if (typeof document !== "undefined") {
  const $ = id => document.getElementById(id);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { /* Storage is optional. */ }

  const state = {
    selected: ["stan"],
    custom: normalizeAccounts(Array.isArray(saved.custom) ? saved.custom : []).slice(0, MAX_CUSTOM)
  };
  const boxes = [...document.querySelectorAll("[data-source]")];
  const dialog = $("customDialog");
  const input = $("typed");

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ custom: state.custom })); } catch { /* Continue without persistence. */ }
  }

  function selectedAccounts() {
    return normalizeAccounts(state.selected.flatMap(key => key === "custom" ? state.custom : COLLECTIONS[key] || []));
  }

  function render() {
    boxes.forEach(box => { box.checked = state.selected.includes(box.dataset.source); });
    $("formMessage").textContent = "";
  }

  function openEditor() {
    $("customAccounts").value = state.custom.map(name => "@" + name).join("\n");
    $("customMessage").textContent = "";
    dialog.showModal();
  }

  boxes.forEach(box => box.addEventListener("change", () => {
    state.selected = boxes.filter(b => b.checked).map(b => b.dataset.source);
    persist();
    render();
    if (box.dataset.source === "custom" && box.checked && !state.custom.length) openEditor();
  }));

  $("editAccounts").addEventListener("click", openEditor);
  $("closeDialog").addEventListener("click", () => dialog.close());
  $("cancelCustom").addEventListener("click", () => dialog.close());
  $("saveCustom").addEventListener("click", () => {
    const raw = $("customAccounts").value.split(/[\s,]+/).filter(Boolean);
    const unique = normalizeAccounts(raw);
    if (raw.some(name => !/^[A-Za-z0-9_]{1,15}$/.test(name.replace(/^@/, "")))) {
      $("customMessage").textContent = "Use valid X usernames: letters, numbers or underscores, up to 15 characters.";
      return;
    }
    if (unique.length > MAX_CUSTOM) {
      $("customMessage").textContent = "Please keep your list to 60 accounts or fewer.";
      return;
    }
    state.custom = unique;
    if (unique.length && !state.selected.includes("custom")) state.selected.push("custom");
    if (!unique.length) state.selected = state.selected.filter(key => key !== "custom");
    persist();
    render();
    dialog.close();
  });

  $("searchForm").addEventListener("submit", event => {
    const accounts = selectedAccounts();
    if (!accounts.length) {
      event.preventDefault();
      $("formMessage").textContent = "Choose a collection, or add accounts to My accounts.";
      return;
    }
    // A native GET form opens X in a new tab without triggering popup blockers.
    $("searchQueryParam").value = createQuery(input.value, accounts, "videos");
    $("searchTabParam").value = "media";
    $("formMessage").textContent = "";
  });
  input.addEventListener("input", () => { $("formMessage").textContent = ""; });

  const heroPreview = $("heroReactionPreview");
  const reactionClips = [
    "img/reactions/reaction-01.mp4",
    "img/reactions/reaction-02.mp4",
    "img/reactions/reaction-03.mp4",
    "img/reactions/reaction-04.mp4",
    "img/reactions/reaction-05.mp4",
    "img/reactions/reaction-06.mp4"
  ];
  if (heroPreview && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let clipIndex = 0;
    function playHeroClip() {
      heroPreview.src = reactionClips[clipIndex];
      heroPreview.load();
      heroPreview.play().catch(() => { /* Keep the poster when autoplay is unavailable. */ });
    }
    heroPreview.muted = true;
    heroPreview.playsInline = true;
    playHeroClip();
    window.setInterval(() => {
      clipIndex = (clipIndex + 1) % reactionClips.length;
      playHeroClip();
    }, 5000);
  }

  // Restore the original typed placeholder without a Typed.js dependency.
  // It does not change the value, and pauses whenever the user interacts.
  const examples = ["Crying...", "Side eye...", "Lady Gaga...", "Wendy Williams...", "Nicki Minaj laughing...", "K-pop fancam...", "Screaming..."];
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let index = 0, letters = 0, deleting = false;
    function tick() {
      if (document.hidden || document.activeElement === input || input.value) {
        window.setTimeout(tick, 650);
        return;
      }
      const phrase = examples[index];
      input.placeholder = phrase.slice(0, letters) + (letters < phrase.length ? "|" : "");
      let delay = 75;
      if (!deleting) {
        if (letters < phrase.length) letters++;
        else { deleting = true; delay = 1450; }
      } else if (letters > 0) { letters--; delay = 36; }
      else { deleting = false; index = (index + 1) % examples.length; delay = 380; }
      window.setTimeout(tick, delay);
    }
    window.setTimeout(tick, 650);
  }

  // Pre-populate the search box from shared links, without modifying SEO metadata.
  const linkedTerm = new URLSearchParams(location.search).get("q");
  if (linkedTerm) input.value = linkedTerm.slice(0, 200);
  render();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COLLECTIONS, normalizeAccounts, createQuery, createURL };
}
