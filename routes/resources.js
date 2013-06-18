var db = require("../db/db");
var Resource = require("../models/resource");
var Relation = require("../models/relation");
var async = require("async");

// OPTIONS whatever
exports.options = function options(req, res) {
    res.set("Access-Control-Allow-Origin", req.get("Origin"));
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.send(200);
};

// GET /
exports.listResources = function listResources(req, res) {
    res.set("Access-Control-Allow-Origin", req.get("Origin"));
    db.list("resource", function(items) {
        res.send({
            ids: items,
            response: {
                code: 200,
                message: "OK"
            }
        });
    });
};

// POST /
exports.createResource = function createResource(req, res) {
    new Resource(req.body).save(function (resource) {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        resource.createToken(function (token) {
            res.send(201, {
                content_upload_url: "http://" + req.get("Host") + "/api/v1/resources/" + resource.id + "/content/" + token,
                resource: resource,
                response: {
                    code: 201,
                    message: "Created"
                }
            });
        });
    });
};

// GET /scan
// Not implemented

// GET /search
// Not implemented

// GET /[id]
exports.getResource = function(req, res) {
    var id = req.params[0];
    db.retrieve("resource", id, function (resourceData) {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        if (resourceData) {
            res.send({
                resource: new Resource(resourceData),
                response: {
                    code: 200,
                    message: "OK"
                }
            });
        } else {
            res.send(404, {
                response: {
                    code: 404,
                    message: "The requested resource does not exist"
                }
            });
        }
    });
};

// PUT /[id]
exports.updateResource = function updateResource(req, res) {
    var id = req.params[0];
    db.retrieve("resource", id, function(resourceData) {
        if (resourceData) {
            res.set("Access-Control-Allow-Origin", req.get("Origin"));
            new Resource(resourceData).update(req.body).save(function (resource) {
                res.send({
                    resource: resource,
                    response: {
                        code: 200,
                        message: "OK"
                    }
                });
            });
        } else {
            res.send(404, {
                response: {
                    code: 404,
                    message: "The requested resource does not exist"
                }
            });
        }
    });
};

// DELETE /[id]
exports.deleteResource = function deleteResource(req, res) {
    var id = req.params[0];

    db.del("resource", id);
    res.set("Access-Control-Allow-Origin", req.get("Origin"));
    res.send({
        response: {
            code: 410,
            message: "Gone"
        }
    });
};

// POST /[id]/content/[token]
exports.addFile = function addFile(req, res) {
    var id = req.params[0];
    var token = req.params[1];
    var files = req.body.remoteFiles;

    db.retrieve("resource", id, function (resourceData) {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        if (resourceData) {

            // Check that the token exists
            var resource = new Resource(resourceData);
            resource.checkToken(token, function (result) {
                if (result) {

                    // Update the resource with the new files
                    resource.content.files = files;
                    resource.removeToken(token).save(function (resource) {
                        res.send({
                            resource: resource,
                            response: {
                                code: 200,
                                message: "OK"
                            }
                        });
                    });
                } else {
                    res.send(403, {
                        response: {
                            code: 403,
                            message: "The provided token is not valid."
                        }
                    });
                }
            });
        } else {
            res.send(404, {
                response: {
                    code: 404,
                    message: "The requested resource does not exist"
                }
            });
        }
    });
};

// POST /[id]/ratings
// Not implemented

// GET /[id]/relations
exports.getRelations = function getRelations(req, res) {
    var id = req.params[0];
    db.list("relation", function (items) {

        // Asynchronously map the ids to their objects
        async.map(items, function (id, callback) {
            db.retrieve("relation", id, function (relation) {
                callback(null, relation);
            });
        }, function (err, results) {
            var relations = results.filter(function (relation) {
                return (relation.subjectId === id || relation.objectId === id);
            });
            res.set("Access-Control-Allow-Origin", req.get("Origin"));
            res.send({
                relations: relations,
                response: {
                    code: 200,
                    message: "OK"
                }
            });
        });
    });
};

// POST /[id]/relations
exports.createRelation = function createRelation(req, res) {
    var id = req.params[0];
    var relation = new Relation(req.body);
    if (!relation.subjectId) {
        relation.subjectId = id;
    }
    relation.save(function (relation) {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        res.send({
            "relation": relation,
            response: {
                code: 201,
                message: "Created"
            }
        });
    });
};

// GET /[id]/request-upload-url
exports.requestUploadUrl = function requestUploadUrl(req, res) {
    var id = req.params[0];
    db.retrieve("resource", id, function (resourceData) {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        if (resourceData) {
            var resource = new Resource(resourceData);
            resource.createToken(function (token) {
                res.send({
                    "content_upload_url": "http://" + req.get("Host") + "/api/v1/resources/" + id + "/content/" + token,
                    response: {
                        code: 200,
                        message: "OK"
                    }
                });
            });
        } else {
            res.send(404, {
                response: {
                    code: 404,
                    message: "The requested resource does not exist"
                }
            });
        }
    });
};

// DELETE /[id]/relations/[relationId]
// Not implemented