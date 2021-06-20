// ReactionHub

// mettere nella page lista operatori https://developer.twitter.com/en/docs/twitter-api/v1/rules-and-filtering/search-operators
// se vuoi fare just one of these keywords fai un'altra funzione che trasforma keyword in keyword con OR

// accounts
let accIta = [
    '@elenoire_video',
    '@OutFacchetti',
    '@oocisola',
    '@oocgfvip5',
    '@divanomat',
    '@follettinaooc',
    '@_niguarda',
    '@OutChiara',
    '@nzvatooc',
    '@BotElenoire',
    '@giussarchive',
    '@falizzovid',
    '@falizzo',
    '@oocgfvip',
    '@memevari'

];

let accStan = [
    '@TheMemesArchive',
    '@memebiblee',
    '@allreactionvids',
    '@findurmeme',
    '@gay_reactions',
    '@dlipameme',
    '@findurvideo',
    '@Ajayreactions',
    '@yakuzareactions',
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
    '@patpatonthecat'
];

let accKpop = [
    '@videonct',
    '@GOT7reactvids',
    '@svtreaction',
    '@chunghareaction',
    '@kpreactionvids',
    '@ex0vid',
    '@kpopreactionss'
];


/* utilities
console.log(accStan.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accKpop.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accIta.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accKpop.length+accStan.length+accIta.length);
*/
// end accounts



function createQuery(keyword: string, accounts: string[]): string{
    let queryAccounts: string = ``;
    for (let e of accounts){
        queryAccounts+= `OR from:`, queryAccounts+=e, queryAccounts+= `, `;
    }
    return "filter:media ".concat(keyword, ` (`, queryAccounts, `)`);
}

function createURL(query: string): string{
    return `https://twitter.com/search?q=`.concat(encodeURI(query));
}

function search(accounts: string[]): void {
    window.open(createURL(createQuery(document.getElementById("typed").value, accounts)));
}

function searchByChecked(): void{
    let accounts: string[] = [];
    if(document.getElementById("stantwitterCheckbox").checked){
        accounts.push(...accStan);
    }
    if(document.getElementById("italiantwitterCheckbox").checked){
        accounts.push(...accIta);
    }
    if(document.getElementById("kpopCheckbox").checked){
        accounts.push(...accKpop);
    }
    search(accounts);
}

// test
/* let accounts: string[] = [`findurmeme`, `allreactionvids`]; 
let keyword: string = `hey`;

console.log(accounts.toString()); 
let myquery = createQuery(keyword, accounts)
console.log( createURL(myquery));  */