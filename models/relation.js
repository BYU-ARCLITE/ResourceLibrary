var merge = require("./merge.js");
var db = require("../db/db");
var guid = require("./guid.js");

function Relation(data) {
    this.id = guid.guid();
    this.subjectId = "";
    this.objectId = "";
    this.type = "part_of";
    this.attributes = {};

    if (data.type === "transcriptOf")
        data.type = "transcript_of";
    
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