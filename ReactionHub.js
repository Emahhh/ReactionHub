"use strict";

// Curated sources. Update these handles as accounts change on X.
const COLLECTIONS = {
  stan: ["TheMemesArchive", "memebiblee", "allreactionvids", "findurmeme", "gay_reactions", "dlipameme", "findurvideo", "Ajayreactions", "acervoqueen", "azealiareacts", "GabbieReaction", "miriamsedit", "ajayiivids", "crack_cloud", "imbabyvids", "ReactionVideos_", "reactvideoos", "VideosFolder", "dustbin_nie"],
  italian: ["elenoire_video", "OutFacchetti", "oocisola", "oocgfvip5", "follettinaooc", "_niguarda", "OutChiara", "nzvatooc", "BotElenoire", "giussarchive", "falizzovid", "oocgfvip", "memevari", "s_medi4", "emanuelabot1", "ItaReaction", "giorgymemes"],
  kpop: ["videonct", "dustbin_nie", "GOT7reactvids", "svtreaction", "chunghareaction", "kpreactionvids", "kpopreactionss", "KpopFancams6", "kpopthins", "fancamie", "multifancams", "kjongincams", "chaelinfancam", "svtfancams", "bangtanfancam", "eternaIsbts", "BTSARMY_fancam", "uhbtscam", "KFiles4u"]
};
const STORAGE_KEY = "reactionhub.v2";
const BATCH_SIZE = 5;
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

// Browser-only behavior; pure search helpers above are independently testable in Node.
if (typeof document !== "undefined") {
  const $ = id => document.getElementById(id);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const defaults = { custom: [], selected: ["stan"], all: false, filter: "media", view: "media", exact: false, recent: [] };
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { /* Private browsing can block storage. */ }
  const state = { ...defaults, ...stored };
  state.custom = normalizeAccounts(Array.isArray(state.custom) ? state.custom : []).slice(0, MAX_CUSTOM);
  state.selected = Array.isArray(state.selected) ? state.selected.filter(s => ["stan", "italian", "kpop", "custom"].includes(s)) : ["stan"];
  state.recent = Array.isArray(state.recent) ? state.recent.slice(0, 6) : [];

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Search still works without storage. */ }
  }

  function selectedAccounts() {
    if (state.all) return [];
    return normalizeAccounts(state.selected.flatMap(name => name === "custom" ? state.custom : COLLECTIONS[name] || []));
  }

  function params() {
    return { keyword: $("typed").value.trim(), accounts: selectedAccounts(), filter: $("mediaFilter").value,
      view: $("resultsView").value, exact: $("exactPhrase").checked };
  }
  function currentQuery() {
    const p = params();
    return createQuery(p.keyword, p.accounts, p.filter, p.exact);
  }

  function setMessage(text) { $("formMessage").textContent = text || ""; }

  function renderControls() {
    $$("[data-source]").forEach(box => { box.checked = state.selected.includes(box.dataset.source); box.disabled = state.all; });
    $("searchAll").checked = state.all;
    $("customSource").disabled = state.all || !state.custom.length;
    $("mediaFilter").value = ["media", "videos", "images"].includes(state.filter) ? state.filter : "media";
    $("resultsView").value = ["media", "live", "top"].includes(state.view) ? state.view : "media";
    $("exactPhrase").checked = Boolean(state.exact);
    for (const name of ["stan", "italian", "kpop"]) $(name + "Count").textContent = COLLECTIONS[name].length + " accounts";
    $("customCount").textContent = state.custom.length ? state.custom.length + " accounts" : "Add your own";
    $("sourceGrid").classList.toggle("is-disabled", state.all);
    renderPreview();
  }

  function renderPreview() {
    const { accounts, keyword, filter, exact } = params();
    $("queryPreview").textContent = currentQuery();
    $("queryPreview").title = currentQuery();
    const count = accounts.length;
    $("sourceSummary").textContent = state.all ? "Searching every public account on X" : count ? `Searching ${count} unique accounts across ${state.selected.length} collection${state.selected.length === 1 ? "" : "s"}` : "Select a collection or search all of X";
    const filterLabel = filter === "videos" ? "Videos only" : filter === "images" ? "Images only" : "All media";
    const viewLabel = $("resultsView").selectedOptions[0].textContent;
    $("optionSummary").textContent = `${filterLabel} · ${viewLabel} tab${exact && keyword ? " · Exact" : ""}`;
    $("copySearch").disabled = !state.all && !count;
  }

  function link(label, url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label + " ↗";
    return a;
  }

  function renderFallbacks(p) {
    const query = createQuery(p.keyword, p.accounts, p.filter, p.exact);
    $("fullSearchLink").href = createURL(query, p.view);
    const wrap = $("batchLinks");
    wrap.replaceChildren();
    if (p.accounts.length > BATCH_SIZE) {
      for (let i = 0; i < p.accounts.length; i += BATCH_SIZE) {
        const group = p.accounts.slice(i, i + BATCH_SIZE);
        wrap.appendChild(link(`Accounts ${i + 1}–${i + group.length}`, createURL(createQuery(p.keyword, group, p.filter, p.exact), p.view)));
      }
    }
    if (p.accounts.length) wrap.appendChild(link("Search all X", createURL(createQuery(p.keyword, [], p.filter, p.exact), p.view)));
    wrap.appendChild(link(p.view === "live" ? "Try Media tab" : "Try Latest tab", createURL(query, p.view === "live" ? "media" : "live")));
    if (p.filter !== "media") wrap.appendChild(link("Try all media", createURL(createQuery(p.keyword, p.accounts, "media", p.exact), p.view)));
    $("searchResults").hidden = false;
  }

  function renderRecent() {
    const wrap = $("recentList");
    wrap.replaceChildren();
    $("recentDetails").hidden = !state.recent.length;
    $("recentEmpty").hidden = Boolean(state.recent.length);
    $("clearRecent").hidden = !state.recent.length;
    for (const item of state.recent) {
      if (!item || typeof item.keyword !== "string") continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "recent-item";
      const label = document.createElement("span");
      label.textContent = item.keyword || "Browse accounts";
      const arrow = document.createElement("span");
      arrow.textContent = "↗";
      arrow.setAttribute("aria-hidden", "true");
      button.append(label, arrow);
      button.title = "Search again on X";
      button.addEventListener("click", () => {
        $("typed").value = item.keyword;
        state.all = Boolean(item.all);
        state.selected = Array.isArray(item.selected) ? item.selected.filter(s => ["stan", "italian", "kpop", "custom"].includes(s)) : ["stan"];
        state.filter = item.filter || "media";
        state.view = item.view || "media";
        state.exact = Boolean(item.exact);
        renderControls();
        $("searchForm").requestSubmit();
      });
      wrap.appendChild(button);
    }
  }

  function remember(p) {
    const item = { keyword: p.keyword, all: state.all, selected: [...state.selected], filter: p.filter, view: p.view, exact: p.exact };
    const signature = JSON.stringify(item);
    state.recent = [item, ...state.recent.filter(other => JSON.stringify(other) !== signature)].slice(0, 6);
    persist();
    renderRecent();
  }

  function onSettingsChange() {
    state.selected = $$("[data-source]:checked").map(box => box.dataset.source);
    state.all = $("searchAll").checked;
    state.filter = $("mediaFilter").value;
    state.view = $("resultsView").value;
    state.exact = $("exactPhrase").checked;
    renderControls();
    persist();
    setMessage("");
  }

  $$("[data-source], #searchAll, #mediaFilter, #resultsView, #exactPhrase").forEach(el => el.addEventListener("change", onSettingsChange));
  $("typed").addEventListener("input", () => { renderPreview(); setMessage(""); });
  $("searchForm").addEventListener("submit", event => {
    const p = params();
    if (!state.all && !p.accounts.length) { event.preventDefault(); setMessage("Choose at least one collection, add custom accounts, or search all of X."); return; }
    if (state.all && !p.keyword) { event.preventDefault(); setMessage("Enter a keyword to search all of X."); return; }
    $("searchQueryParam").value = createQuery(p.keyword, p.accounts, p.filter, p.exact);
    $("searchTabParam").value = p.view;
    renderFallbacks(p);
    remember(p);
    setMessage("");
    // Let the native GET form submit open the X search in a new tab (no popup blocker).
  });

  $$("#suggestions [data-query]").forEach(button => button.addEventListener("click", () => {
    $("typed").value = button.dataset.query;
    renderPreview();
    $("typed").focus();
  }));

  $("copySearch").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(createURL(currentQuery(), $("resultsView").value));
      const button = $("copySearch");
      button.textContent = "Copied ✓";
      setTimeout(() => { button.textContent = "Copy link ↗"; }, 1800);
    } catch { setMessage("Couldn't copy automatically. Select the search query above or use Search on X."); }
  });

  $("clearRecent").addEventListener("click", () => { state.recent = []; persist(); renderRecent(); });
  const dialog = $("customDialog");
  $("editAccounts").addEventListener("click", () => {
    $("customAccounts").value = state.custom.map(h => "@" + h).join("\n");
    $("customMessage").textContent = "";
    dialog.showModal();
  });
  $("closeDialog").addEventListener("click", () => dialog.close());
  $("cancelCustom").addEventListener("click", () => dialog.close());
  $("saveCustom").addEventListener("click", () => {
    const raw = $("customAccounts").value.split(/[\s,]+/).filter(Boolean);
    const valid = normalizeAccounts(raw);
    if (raw.length && !valid.length) { $("customMessage").textContent = "Please enter valid X usernames (letters, numbers and underscores only)."; return; }
    if (valid.length > MAX_CUSTOM) { $("customMessage").textContent = "Please keep this list to 60 accounts or fewer."; return; }
    state.custom = valid;
    state.selected = state.selected.filter(name => name !== "custom");
    if (valid.length) state.selected.push("custom");
    dialog.close();
    persist();
    renderControls();
  });

  // Simple deep links: https://.../?q=crying (useful when sharing the web app).
  const incoming = new URLSearchParams(location.search).get("q");
  if (incoming) $("typed").value = incoming.slice(0, 200);
  renderControls();
  renderRecent();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COLLECTIONS, normalizeAccounts, createQuery, createURL };
}
