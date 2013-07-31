/**
 * Created with IntelliJ IDEA.
 * User: camman3d
 * Date: 3/13/13
 * Time: 11:17 AM
 * To change this template use File | Settings | File Templates.
 */

var merge = require("./merge.js");
var db = require("../db/db");
var guid = require("./guid.js");

function Resource(data) {
    this.id = guid.guid();
    //this.categories = [];
    this.dateModified = new Date().toISOString();
    this.description = "";
    this.keywords = "";

    // Language fix
    this.languages = {};
    if (data.language)
        this.languages = {
            iso639_3: [data.language]
        };
    if (data.languages instanceof Array)
        data.languages = {
            iso639_3: data.languages
        };


    this.status = "awaiting content";
    this.title = "Unnamed";
    this.type = "data";
    this.content = {
        files: []
    };
    this.clientUser = {};

    // See if we are creating this resource from something
    if (data) {
        // Create resource from object
        merge(this, data);
    }

    // Make sure mime types and bytes are there for the files
    for(var i=0; i<this.content.files.length; i++) {
        if (!this.content.files[i].mimeType && this.content.files[i].mime)
            this.content.files[i].mimeType = this.content.files[i].mime;
        if (!this.content.files[i].mime && this.content.files[i].mimeType)
            this.content.files[i].mime = this.content.files[i].mimeType;

        if (!this.content.files[i].bytes)
            this.content.files[i].bytes = 0;
    }

    // Make sure that "text" type is actually "document"
    if (this.type === "text")
        this.type = "document";

    // Backwards compatibility between attributes and  clientUser
    if (this.attributes && this.attributes.ayamel_ownerType && this.attributes.ayamel_ownerId) {
        this.clientUser = {
            id: this.attributes.ayamel_ownerType + ":" + this.attributes.ayamel_ownerId
        };
        if (this.attributes && this.attributes.publishStatus === "requested")
            this.clientUser.id = this.clientUser.id + ":request";
    }
}

Resource.prototype.save = function (callback) {
    var _this = this;
    db.save("resource", this.id, this, function (data) {
        merge(_this, data);
        callback(_this);
    });
};

Resource.prototype.del = function () {
    db.del("resource", this.id);
};

Resource.prototype.update = function (data) {
    merge(this, data);
    return this;
};

Resource.prototype.createToken = function (callback) {
    var token = guid.token();
    var _this = this;
    db.retrieve("token", this.id, function (data) {
        if (data) {
            data.tokens.push(token);
        } else {
            data = {
                tokens: [token]
            };
        }
        db.save("token", _this.id, data);
        callback(token);
    });
};

Resource.prototype.checkToken = function (token, callback) {
    db.retrieve("token", this.id, function (data) {
        if (data) {
            callback(data.tokens.indexOf(token) >= 0);
        } else {
            callback(false);
        }
    });
};

Resource.prototype.removeToken = function (token) {
    var _this = this;
    db.retrieve("token", this.id, function (data) {
        var index = data.tokens.indexOf(token);
        if (index >= 0) {
            data.tokens.splice(index, 1);
            db.save("token", _this.id, data);
        }
    });
    return this;
};

module.exports = Resource;