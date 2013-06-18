var merge = require("./merge.js");
var db = require("../db/db");

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function Relation(data) {
    this.id = guid();
    this.subjectId = "";
    this.objectId = "";
    this.type = "part_of";
    this.attributes = {};

    if (data) {
        merge(this, data);
    }
}

Relation.prototype.save = function (callback) {
    var _this = this;
    db.save("relation", this.id, this, function (data) {
        merge(_this, data);
        callback(_this);
    });
};

Relation.prototype.del = function () {
    db.del("relation", this.id);
};

//Relation.prototype.update = function (data) {
//    merge(this, data);
//    return this;
//};

module.exports = Relation;