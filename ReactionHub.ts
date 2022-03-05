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
const TEST = true;
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

function createQuery(keyword: string, accounts: string[]): string{
    let queryAccounts: string = ``;
    for (let e of accounts){
        queryAccounts+= `OR from:`;
        queryAccounts+=e;
        queryAccounts+= `, `;
    }
    queryAccounts = queryAccounts.substring(0, queryAccounts.length - 2);
    return "filter:media ".concat(keyword, ` (`, queryAccounts, `)`);
}

function createURL(query: string): string{
    return `https://twitter.com/search?q=`.concat(encodeURI(query));
}

function search(accounts: string[]): void {
    window.open(createURL(createQuery((<HTMLInputElement>document.getElementById("typed")).value, accounts)));
}

function searchByChecked(): void{
    let accounts: string[] = [];
    if((<HTMLInputElement>document.getElementById("stantwitterCheckbox")).checked){
        accounts.push(...accStan);
    }
    if((<HTMLInputElement>document.getElementById("italiantwitterCheckbox")).checked){
        accounts.push(...accIta);
    }
    if((<HTMLInputElement>document.getElementById("kpopCheckbox")).checked){
        accounts.push(...accKpop);
    }
    search(accounts);

    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
        window.open(window.location.href,"_self")
    }
}
