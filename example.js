var Acx = require('./acx.js');

var acx = new Acx();
// acx.ticker('btcaud',console.log);
//acx.markets(console.log);
//
var key = '';
var secret = '';
var timeout = 10000;
var acx = new Acx(key, secret, timeout);
acx.balance(console.log);
