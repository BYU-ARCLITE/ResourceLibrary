/*
 * This is a fake database wrapper. Can be replaced with anything as long as it
 * matches the same interface:
 *  retrieve(id: String): Resource
 *  save(id: String, obj: Resource): Resource
 *  remove(obj: Resource): Unit
 *  list(): Array[String]
 */

var db = {
    resource: {
        "e36264d8-1194-4271-cbcd-780f5e500980": {
            id: "e36264d8-1194-4271-cbcd-780f5e500980",
            title: "Test resource 1"
        }
    },
    token: {
        "e36264d8-1194-4271-cbcd-780f5e500980": ["780f5e500980"]
    },
    relation: {}
};

exports.retrieve = function retrieve(model, id) {
    return db[model][id];
};

exports.save = function save(model, id, obj) {
    db[model][id] = obj;
    return obj;
};

exports.del = function del(model, id) {
    delete db[model][id];
};

exports.list = function list(model) {
    return Object.keys(db[model]);
};