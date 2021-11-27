'use strict'

const fs = require('fs'),
    path = require('path')

const router = require('express').Router(),
    contentDisposition = require('content-disposition')

const generateLink = require('./generateLink')

router.get('/:contentId', (req, res, next) => {
    let { contentId } = req.params
    if (contentId) {
        const filePath = generateLink.getFilePath(contentId)
        const readStream = fs.createReadStream(filePath)
        res.set('Content-Disposition', contentDisposition(path.basename(filePath)))
        readStream.pipe(res)
    } else {
        res.sendStatus(404)
    }
})

module.exports = exports = router