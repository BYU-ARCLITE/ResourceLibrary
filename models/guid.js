/**
 * Created with IntelliJ IDEA.
 * User: camman3d
 * Date: 6/18/13
 * Time: 11:12 AM
 * To change this template use File | Settings | File Templates.
 */

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

module.exports = {
    s4: s4,
    guid: function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    token: function token() {
        return s4() + s4() + s4();
    }
};