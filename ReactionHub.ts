// accounts
let accIta = [
    '@elenoire_video',
    '@OutFacchetti',
    '@oocisola',
    '@oocgfvip5',
    // '@divanomat',
    '@follettinaooc',
    '@_niguarda',
    '@OutChiara',
    '@nzvatooc',
    '@BotElenoire',
    '@giussarchive',
    '@falizzovid',
    '@oocgfvip',
    '@memevari',
    's_medi4',
    'emanuelabot1',
    '@ItaReaction',
    '@giorgymemes',
];

// limit of 20 reached
let accStan = [
    '@TheMemesArchive',
    '@memebiblee',
    '@allreactionvids',
    '@findurmeme',
    '@gay_reactions',
    '@dlipameme',
    '@findurvideo',
    '@Ajayreactions',
    // '@yakuzareactions',
    '@acervoqueen',
    '@azealiareacts',
    '@GabbieReaction',
    '@miriamsedit',
    '@ajayiivids',
    '@crack_cloud',
    '@imbabyvids',
    '@ReactionVideos_',
    '@reactvideoos',
    '@VideosFolder',
    '@dustbin_nie',
   // '@patpatonthecat',
   // '@reaction_hub',
    //'@poppersboomclap'
];

let accKpop = [
    '@videonct',
    '@dustbin_nie',
    '@GOT7reactvids',
    '@svtreaction',
    '@chunghareaction',
    '@kpreactionvids',
    // '@ex0vid',
    '@kpopreactionss',
    '@KpopFancams6',
    '@kpopthins',
    '@fancamie',
    '@multifancams',
    '@kjongincams',
    '@chaelinfancam',
  //  '@skizfancams',
    '@svtfancams',
   //  '@jenniesverses',
    '@bangtanfancam',
    '@eternaIsbts',
    '@BTSARMY_fancam',
    '@uhbtscam',
    '@KFiles4u'	
   // '@loonafancamss',
   // '@Ioonacams',
   //  '@jinsoulcam'
];


// test utilities - put true to test
const TEST = false;
if (TEST){
    function showDuplicates(arr: string[]): string[]{
        // make all strings lowercase
        arr = arr.map(e => e.toLowerCase());
        // remove duplicates
        return arr.filter((elem, index, self) => index !== self.indexOf(elem));
    }

    // query limit is apparently ~20 acccounts per search
    console.log(showDuplicates(accStan));
    console.log(accStan.length);

    console.log(showDuplicates(accIta));
    console.log(accIta.length);

    console.log(showDuplicates(accKpop));
    console.log(accKpop.length);

    console.log(accKpop.length+accStan.length+accIta.length);
}

// Kept in sync with ReactionHub.js (the script loaded by index.html).
const SEARCH_CHUNK_SIZE = 5;

function normalizeAccounts(accounts: string[]): string[] {
    const seen = new Set<string>();
    return accounts.map(account => account.trim().replace(/^@/, ""))
        .filter(account => {
            if (!/^[A-Za-z0-9_]{1,15}$/.test(account)) return false;
            const key = account.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function createQuery(keyword: string, accounts: string[], mediaFilter = "media"): string {
    const handles = normalizeAccounts(accounts);
    const authors = handles.length
        ? "(" + handles.map(handle => "from:" + handle).join(" OR ") + ")"
        : "";
    const filter = mediaFilter === "videos" ? "filter:videos" : "filter:media";
    return [keyword.trim(), authors, filter].filter(Boolean).join(" ");
}

function createURL(query: string, view = "media"): string {
    const tab = view === "live" ? "live" : "media";
    return "https://x.com/search?q=" + encodeURIComponent(query) + "&f=" + tab;
}

function showFallbackLinks(keyword: string, accounts: string[], mediaFilter: string, view: string): void {
    const container = document.getElementById("searchLinks");
    if (!container) return;
    container.replaceChildren();
    const title = document.createElement("h5");
    title.textContent = "X showing no results? Try a smaller search";
    container.appendChild(title);
    const help = document.createElement("p");
    help.className = "small";
    help.textContent = "Long searches can be unreliable on X. These links use the same keyword and smaller account groups.";
    container.appendChild(help);
    function addLink(label: string, query: string): void {
        const link = document.createElement("a");
        link.className = "btn btn-outline-primary btn-sm me-2 mb-2";
        link.href = createURL(query, view);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        container.appendChild(link);
    }
    for (let start = 0; start < accounts.length; start += SEARCH_CHUNK_SIZE) {
        const batch = accounts.slice(start, start + SEARCH_CHUNK_SIZE);
        addLink("Accounts " + (start + 1) + "–" + (start + batch.length), createQuery(keyword, batch, mediaFilter));
    }
    addLink("All X (no account filter)", createQuery(keyword, [], mediaFilter));
    container.hidden = false;
}

function search(accounts: string[]): void {
    const input = document.getElementById("typed") as HTMLInputElement;
    const exact = document.getElementById("exactPhraseCheckbox") as HTMLInputElement | null;
    const filterInput = document.getElementById("mediaFilter") as HTMLSelectElement | null;
    const viewInput = document.getElementById("resultsView") as HTMLSelectElement | null;
    const typed = input.value.trim();
    const keyword = exact && exact.checked && typed
        ? '"' + typed.replace(/"/g, "") + '"'
        : typed;
    const filter = filterInput ? filterInput.value : "media";
    const view = viewInput ? viewInput.value : "media";
    const uniqueAccounts = normalizeAccounts(accounts);
    showFallbackLinks(keyword, uniqueAccounts, filter, view);
    window.open(createURL(createQuery(keyword, uniqueAccounts, filter), view), "_blank", "noopener,noreferrer");
}

function searchByChecked(): void {
    const accounts: string[] = [];
    if ((document.getElementById("stantwitterCheckbox") as HTMLInputElement).checked) accounts.push(...accStan);
    if ((document.getElementById("italiantwitterCheckbox") as HTMLInputElement).checked) accounts.push(...accIta);
    if ((document.getElementById("kpopCheckbox") as HTMLInputElement).checked) accounts.push(...accKpop);
    search(accounts);
}
