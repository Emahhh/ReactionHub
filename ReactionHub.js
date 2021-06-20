"use strict";
// ReactionHub
Object.defineProperty(exports, "__esModule", { value: true });
// mettere nella page lista operatori https://developer.twitter.com/en/docs/twitter-api/v1/rules-and-filtering/search-operators
// se vuoi fare just one of these keywords fai un'altra funzione che trasforma keyword in keyword con OR
var accountsLists = require("./accounts.js");
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
        accounts.push(accountsLists.accStan);
    }
    if (document.getElementById("italiantwitterCheckbox").checked) {
        accounts.push(accountsLists.accIta);
    }
    if (document.getElementById("kpopCheckbox").checked) {
        accounts.push(accountsLists.accKpop);
    }
    search(accounts);
}
