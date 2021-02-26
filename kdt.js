"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.deleteNode = exports.insertNode = exports.balanceKdtree = void 0;
var alpha = 0.6;
var chooseDimension = function (nodes) {
    var sumX = 0., sumY = 0., sumZ = 0.;
    var cubeX = 0., cubeY = 0., cubeZ = 0.;
    nodes.forEach(function (node) {
        sumX += node.x;
        sumY += node.y;
        sumZ += node.z;
    });
    sumX /= nodes.length, sumY /= nodes.length, sumZ /= nodes.length;
    nodes.forEach(function (node) {
        cubeX += (node.x - sumX) * (node.x - sumX);
        cubeY += (node.y - sumY) * (node.y - sumY);
        cubeZ += (node.z - sumZ) * (node.z - sumZ);
    });
    var cubeMax = Math.max(cubeX, cubeY, cubeZ);
    if (Math.abs(cubeMax - cubeX) < 1e-8)
        return 0;
    else if (Math.abs(cubeMax - cubeY) < 1e-8)
        return 1;
    else
        return 2;
};
var balanceKdtree = function (nodes) {
    var dimension = chooseDimension(nodes);
    if (nodes.length === 0) {
        var cur = {
            pos: nodes[0],
            dimension: 0,
            divider: nodes[0].x,
            left: null,
            right: null,
            size: 1,
            exists: true,
            deleteNum: 0
        };
        return cur;
    }
    if (dimension === 0) {
        nodes.sort(function (a, b) {
            return (a.x < b.x ? -1 : 1);
        });
        var divp = Math.floor((nodes.length / 2));
        var cur = {
            pos: nodes[divp],
            dimension: 0,
            divider: nodes[divp].x,
            left: divp > 0 ? balanceKdtree(nodes.slice(0, divp)) : null,
            right: divp + 1 < nodes.length ? balanceKdtree(nodes.slice(divp + 1, nodes.length)) : null,
            size: nodes.length,
            exists: true,
            deleteNum: 0
        };
        return cur;
    }
    if (dimension === 1) {
        nodes.sort(function (a, b) {
            return (a.y < b.y ? -1 : 1);
        });
        var divp = Math.floor((nodes.length / 2 + 0.5));
        var cur = {
            pos: nodes[divp],
            dimension: 1,
            divider: nodes[divp].y,
            left: divp > 0 ? balanceKdtree(nodes.slice(0, divp)) : null,
            right: divp + 1 < nodes.length ? balanceKdtree(nodes.slice(divp + 1, nodes.length)) : null,
            size: nodes.length,
            exists: true,
            deleteNum: 0
        };
        return cur;
    }
    if (dimension === 2) {
        nodes.sort(function (a, b) {
            return (a.z < b.z ? -1 : 1);
        });
        var divp = Math.floor((nodes.length / 2 + 0.5));
        var cur = {
            pos: nodes[divp],
            dimension: 2,
            divider: nodes[divp].z,
            left: divp > 0 ? balanceKdtree(nodes.slice(0, divp)) : null,
            right: divp + 1 < nodes.length ? balanceKdtree(nodes.slice(divp + 1, nodes.length)) : null,
            size: nodes.length,
            exists: true,
            deleteNum: 0
        };
        return cur;
    }
};
exports.balanceKdtree = balanceKdtree;
var getSeq = function (root, cur) {
    if (root.left !== null)
        cur = __spreadArrays(cur, getSeq(root.left, cur));
    if (root.right !== null)
        cur = __spreadArrays(cur, getSeq(root.right, cur));
    if (root.exists)
        cur = __spreadArrays(cur, [root.pos]);
    return cur;
};
var insertNode = function (node, root) {
    if (root === null) {
        root = {
            pos: node,
            dimension: 0,
            divider: node.x,
            left: null,
            right: null,
            size: 1,
            exists: true,
            deleteNum: 0
        };
        return root;
    }
    if (root.dimension === 0) {
        if (node.x < root.divider) {
            root.left = insertNode(node, root.left);
        }
        else
            root.right = insertNode(node, root.right);
    }
    if (root.dimension === 1) {
        if (node.y < root.divider) {
            root.left = insertNode(node, root.left);
        }
        else
            root.right = insertNode(node, root.right);
    }
    if (root.dimension === 2) {
        if (node.z < root.divider) {
            root.left = insertNode(node, root.left);
        }
        else
            root.right = insertNode(node, root.right);
    }
    root.size = (root.left !== null ? root.left.size : 0) + (root.right !== null ? root.right.size : 0);
    if (Math.max((root.left !== null ? root.left.size : 0), (root.right !== null ? root.right.size : 0)) / root.size > alpha) {
        root = balanceKdtree(getSeq(root, []));
    }
    return root;
};
exports.insertNode = insertNode;
var compareNode = function (a, b) {
    if (Math.abs(a.x - b.x) < 1e-8)
        if (Math.abs(a.y - b.y) < 1e-8)
            if (Math.abs(a.z - b.z) < 1e-8)
                return true;
    return false;
};
var deleteNode = function (node, root) {
    if (compareNode(root.pos, node)) {
        if (root.exists) {
            root.exists = false;
            root.deleteNum++;
        }
        return root;
    }
    if (root.dimension === 0) {
        if (node.x < root.divider) {
            root.left = deleteNode(node, root.left);
        }
        else
            root.right = deleteNode(node, root.right);
    }
    if (root.dimension === 1) {
        if (node.y < root.divider) {
            root.left = deleteNode(node, root.left);
        }
        else
            root.right = deleteNode(node, root.right);
    }
    if (root.dimension === 2) {
        if (node.z < root.divider) {
            root.left = deleteNode(node, root.left);
        }
        else
            root.right = deleteNode(node, root.right);
    }
    root.deleteNum = (root.left !== null ? root.left.deleteNum : 0) + (root.right !== null ? root.right.deleteNum : 0);
    if (root.deleteNum / root.size > alpha) {
        root = balanceKdtree(getSeq(root, []));
    }
    return root;
};
exports.deleteNode = deleteNode;
