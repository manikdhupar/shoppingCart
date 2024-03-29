const fs = require('fs');

const deleteFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      throw Error(err);
    }
  });
};

exports.deleteFile = deleteFile;
