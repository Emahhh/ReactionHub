// ReactionHub
// mettere nella page lista operatori https://developer.twitter.com/en/docs/twitter-api/v1/rules-and-filtering/search-operators
// se vuoi fare just one of these keywords fai un'altra funzione che trasforma keyword in keyword con OR
// accounts
var accIta = [
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
    '@oocgfvip',
    '@memevari'
];
var accStan = [
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
var accKpop = [
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
function createQuery(keyword, accounts) {
    var queryAccounts = "";
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var e = accounts_1[_i];
        queryAccounts += "OR from:", queryAccounts += e, queryAccounts += ", ";
    }
    return "filter:media ".concat(keyword, " (", queryAccounts, ")");
}
function createURL(query) {
    return "https://twitter.com/search?q=".concat(encodeURI(query));
}
function search(accounts) {
    window.open(createURL(createQuery(document.getElementById("typed").value, accounts)));
}
function searchByChecked() {
    var accounts = [];
    if (document.getElementById("stantwitterCheckbox").checked) {
        accounts.push.apply(accounts, accStan);
    }
    if (document.getElementById("italiantwitterCheckbox").checked) {
        accounts.push.apply(accounts, accIta);
    }
    if (document.getElementById("kpopCheckbox").checked) {
        accounts.push.apply(accounts, accKpop);
    }
    search(accounts);
}
// test
/* let accounts: string[] = [`findurmeme`, `allreactionvids`];
let keyword: string = `hey`;

console.log(accounts.toString());
let myquery = createQuery(keyword, accounts)
console.log( createURL(myquery));  */ 
