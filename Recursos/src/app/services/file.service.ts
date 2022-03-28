import { Injectable } from '@angular/core';
import { Plugins, FilesystemDirectory } from '@capacitor/core';

const { Filesystem, Camera } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  async readFile(path: string) {
    /* try {
      let contents = await Filesystem.readFile({
        path: path,
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      console.error('Unable to make directory', e);
    }
    console.log('fileRead', contents); */
  }

  async readFolder(path: string) {
    try {
      let a = await Filesystem.readdir({
        path: '',
        directory: FilesystemDirectory.Documents
      });

      console.log('leer folder', a);

    } catch (e) {
      console.error('Unable to read directory', e);
    }
  }



  async mkdir(path: string) {
    try {
      await Filesystem.readdir({
        path: path,
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      try {
        await Filesystem.mkdir({
          path: path,
          directory: FilesystemDirectory.Documents,
          recursive: true
        })
      } catch (e) {
        console.error('Unable to make directory', e);
      }
    }
  }
}
