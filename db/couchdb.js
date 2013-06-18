var nano = require("nano")("http://localhost:5984");

var db = {
    resource: nano.use("ra_resource"),
    relation: nano.use("ra_relation"),
    token: nano.use("ra_token")
};

exports.retrieve = function retrieve(model, id, callback) {
    db[model].get(id, function (err, body) {
        if (callback) {
            callback(body);
        }
    });
};

exports.save = function save(model, id, obj, callback) {
    db[model].insert(obj, id, function (err, body) {
        if (callback) {
            callback(body);
        }
    });
};

exports.del = function del(model, id) {
//    delete db[model][id];
    console.log("Delete not implemented.");
};

exports.list = function list(model, callback) {
    db[model].list(function (err, body) {
        if (callback) {
            callback(body.rows.map(function (entry) {
                return entry.id;
            }));
        }
    });
};