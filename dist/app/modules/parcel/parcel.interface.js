"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["REQUESTED"] = "requested";
    ParcelStatus["APPROVED"] = "approved";
    ParcelStatus["DISPATCHED"] = "dispatched";
    ParcelStatus["IN_TRANSIT"] = "inTransit";
    ParcelStatus["DELIVERED"] = "delivered";
    ParcelStatus["CANCELLED"] = "cancelled";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
