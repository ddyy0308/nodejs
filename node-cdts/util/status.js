/**
 * Created by yong.deng on 2016/10/10.
 */

'use strict';

/**
 * Module exports.
 */

var status = {};
module.exports = status;

/**
 * data structure for return result
 * @private
 * @type {{status: number, data: Array}}
 */
var ret = {status:0, data:[]};

/**
 * Set success status.
 * @public
 * @param data
 * @returns {{status: number, data: Array}|*}
 */
status.setSuccess = function(data){
    ret.data = data;
    return ret;
};

/**
 * Set fail status.
 * @public
 * @param {String} msg
 * @returns {{status: number, data: string}|*}
 */
status.setFail = function(msg){
    ret.status = -1;
    ret.data = msg;
    return ret;
};
