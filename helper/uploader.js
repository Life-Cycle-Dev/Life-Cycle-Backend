const _ = require('lodash');
const axios = require('axios').default;
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const promisify = require('util').promisify;
const mime = require('mime-types');
require('dotenv').config();

module.exports = {
  getFileDetails(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) reject(err.message);
        resolve(stats);
      });
    });
  },

  deleteFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) reject(err.message);
        resolve('deleted');
      });
    });
  },

  async uploadToLibrary(imageByteStreamURL) {
    const filePath = "";
    if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'develop') {
      filePath = `/tmp/${_.random(1000000000000, 9999999999999)}.jpg`;
    } else {
      filePath = `./tmp/${_.random(1000000000000, 9999999999999)}.jpg`;
    }
    
    const { data } = await axios.get(imageByteStreamURL, {
      responseType: 'stream',
    });

    const file = fs.createWriteStream(filePath);
    const finished = promisify(stream.finished);
    data.pipe(file);
    await finished(file);
    const image = await this.upload(filePath, 'uploads/uploader');
    return image;
  },

  async upload(filePath, saveAs) {
    const stats = await this.getFileDetails(filePath);
    const fileName = path.parse(filePath).base;

    const res = await strapi.plugins.upload.services.upload.upload({
      data: { path: saveAs },
      files: {
        path: filePath,
        name: fileName,
        type: mime.lookup(filePath),
        size: stats.size,
      },
    });

    await this.deleteFile(filePath);
    return _.first(res);
  },
};