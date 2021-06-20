// ReactionHub

// mettere nella page lista operatori https://developer.twitter.com/en/docs/twitter-api/v1/rules-and-filtering/search-operators
// se vuoi fare just one of these keywords fai un'altra funzione che trasforma keyword in keyword con OR
import * as accountsLists from './accounts.js';

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
    window.open(createURL(document.getElementById("typed").value, accounts));
}

function searchByChecked(): void{
    let accounts: string[] = [];
    if(document.getElementById("stantwitterCheckbox").checked){
        accounts.push(accountsLists.accStan);
    }
    if(document.getElementById("italiantwitterCheckbox").checked){
        accounts.push(accountsLists.accIta);
    }
    if(document.getElementById("kpopCheckbox").checked){
        accounts.push(accountsLists.accKpop);
    }
    search(accounts);
}