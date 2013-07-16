/**
 * Created with IntelliJ IDEA.
 * User: camman3d
 * Date: 6/18/13
 * Time: 11:20 AM
 * To change this template use File | Settings | File Templates.
 */
var db = require("../db/db");
var Resource = require("../models/resource");
var Relation = require("../models/relation");
var async = require("async");

// GET /relations
exports.getRelations = function getRelations(req, res) {
    var id = req.query.id;
    var subjectId = req.query.subjectId;
    var objectId = req.query.objectId;
    db.list("relation", function (items) {

        // Asynchronously map the ids to their objects
        async.map(items, function (id, callback) {
            db.retrieve("relation", id, function (relation) {
                callback(null, relation);
            });
        }, function (err, results) {

            // Filter
            var relations = results.filter(function (relation) {
                if (id)
                    return (relation.subjectId === id || relation.objectId === id);
                else if (subjectId)
                    return relation.subjectId === subjectId;
                else if (objectId)
                    return relation.objectId === objectId;
                else
                    return true;
            });

            // Send the results back
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

// POST /relations
exports.createRelation = function createRelation(req, res) {
    var relation = new Relation(req.body);
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

// DELETE /relations/id
exports.deleteRelation = function deleteRelation(req, res) {
    var id = req.params[0];

    db.del("relation", id);
    res.set("Access-Control-Allow-Origin", req.get("Origin"));
    res.send({
        response: {
            code: 410,
            message: "Gone"
        }
    });
};