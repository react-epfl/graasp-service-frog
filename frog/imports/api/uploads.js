// @flow

import { FS } from 'meteor/cfs:base-package';

export const Uploads = new FS.Collection('uploads', {
  stores: [new FS.Store.FileSystem('uploads')]
});

Uploads.allow({ insert: () => true });

export const uploadFile = (files: Array<any>, callback: Function) => {
  if (files.length > 1) {
    window.alert('Only 1 file at a time please'); //eslint-disable-line
  } else {
    Uploads.insert(files[0], (err, fileObj) => {
      const newUrl =
        window.location.origin + '/cfs/files/uploads/' + fileObj._id;
      if (!err) callback(newUrl, '');
    });
  }
};
