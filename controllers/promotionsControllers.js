const e = require('express');
const { ObjectId } = require('mongodb');
const promotionsServices = require('../model/promotionsServices');
exports.index = async (req, res, next) => {
    const promotions = await promotionsServices.getAll();
    promotions.forEach(element => {
        const less = 300;
        if (element.CONTENT.length >= less) {
            element.contentLess = element.CONTENT.substring(0, less);
            element.contentMore = element.CONTENT.substring(less, element.CONTENT.length);
        } else {
            element.contentLess = element.CONTENT.substring(0, element.CONTENT.length);
        }
    });
    res.render('./promotion/promotions', { title: 'Promotion Page', user: req.user, promotions: promotions });
}

exports.detail = async (req, res, next) => {
    const { id } = req.query;
    const detailPromotion = await promotionsServices.findOne({ _id: new ObjectId(id), ACTIVE: true });
    // res.json(detailPromotioin);
    res.render('./promotion/detail', { title: 'Promotion Detial Page', user: req.user, promotion: detailPromotion });
}