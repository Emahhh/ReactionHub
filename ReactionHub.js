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
    '@memevari',
    's_medi4',
    'emanuelabot1',
    '@ItaReaction'
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
    '@patpatonthecat',
    '@reaction_hub'
];
var accKpop = [
    '@videonct',
    '@GOT7reactvids',
    '@svtreaction',
    '@chunghareaction',
    '@kpreactionvids',
    '@ex0vid',
    '@kpopreactionss',
    '@KpopFancams6',
    '@kpopthins',
    '@fancamie',
    '@multifancams',
    '@kjongincams',
    '@chaelinfancam',
    '@skizfancams',
    '@svtfancams',
    '@jenniesverses',
    '@bangtanfancam',
    '@eternaIsbts',
    '@BTSARMY_fancam',
    '@uhbtscam',
    '@loonafancamss',
    '@Ioonacams',
    '@jinsoulcam'
];
// utilities
/* console.log(accStan.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accKpop.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accIta.filter(( t={}, a=> (t[a]=a in t) )));
console.log(accKpop.length+accStan.length+accIta.length); */
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
    window.focus();
}
