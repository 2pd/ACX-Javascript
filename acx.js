var request = require('request');
var querystring = require('querystring');
var crypto = require('crypto');
var _ = require('underscore');

var Acx = function(key, secret, timeout){
  this.key = key;
  this.secret = secret;
  this.timeout = timeout;
};

Acx.prototype._request = function(method, path, data, callback) {
  var _endpoint = 'https://acx.io/api/v2/';
  request(_endpoint+path, function(err, response, body) {
    if (err) {
      return callback(err);
    }
    return callback(body);
  });
};


Acx.prototype._get = function (method, callback, args) {

  var _path = method;
  _path += (querystring.stringify(args) === '' ? '/' : '/?') + querystring.stringify(args);
  this._request('get', _path, undefined, callback);
};

Acx.prototype.ticker = function (pair, callback) {
  if (!pair) {
   this._get('tickers.json', callback);
  }else{
   this._get('tickers/' + pair + '.json', callback);
  }
};

Acx.prototype.timestamp = function (callback) {
  this._get('timestamp.json', callback);
};


Acx.prototype.orderbook = function (pair, callback, args) {

  args = _.extend({
    market: pair
  }, args);

  this._get('order_book.json', callback, args);
};

Acx.prototype.depth = function (pair, callback, args) {

  args = _.extend({
    market: pair
  }, args);

  this._get('depth.json', callback, args);
};

Acx.prototype.trades = function (pair, callback, args) {

  args = _.extend({
    market: pair
  }, args);

  this._get('trades.json', callback, args);
};


Acx.prototype.k = function (pair, callback, args) {

  args = _.extend({
    market: pair
  }, args);

  this._get('k.json', callback, args);
};


Acx.prototype.markets = function (callback) {
  this._get(undefined, 'markets.json', callback);
};


Acx.prototype._post = function (pair, method, callback) {
  if (!this.key || !this.secret) {
    return callback(new Error('Must provide key and secret'));
  }

  var tonce = Math.floor(Date.now());
  var payload = 'GET|/api/v2/' + method + '|access_key=' + this.key + '&tonce=' + tonce;
  console.log(payload);
  var signature = crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
  var path = method + '?access_key=' + this.key + '&tonce=' + tonce + '&signature=' + signature;
  this._request('get', path, undefined, callback);
}


Acx.prototype.balance = function(callback) {
  this._post(undefined, 'members/me.json', callback);
}

module.exports = Acx;
