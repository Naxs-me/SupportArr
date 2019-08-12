'use babel';

import MySecondPackageView from './my-second-package-view';
import { CompositeDisposable } from 'atom';

export default {

  mySecondPackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    console.log("Activate");
    this.mySecondPackageView = new MySecondPackageView(state.mySecondPackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mySecondPackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'my-second-package:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    console.log("Deactivate");
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mySecondPackageView.destroy();
  },

  serialize() {
    return {
      mySecondPackageViewState: this.mySecondPackageView.serialize()
    };
  },

  toggle() {
    console.log('MySecondPackage was toggled!');
    if(this.modalPanel.isVisible()){
      this.mySecondPackageView.empty_array();
      this.modalPanel.hide();
    }
    else{
      const editor = atom.workspace.getActiveTextEditor();
      console.log(editor);
      console.log(editor.getSelectedText());
      var completeCode = editor.getText();
      var cursorPosition = editor.getCursorBufferPosition();
      const fs = require('fs');
// Data which will write in a file.
      let data = completeCode;
// Write data in 'Output.txt' .
      fs.writeFile('Output.txt', data, (err) => {
    // In case of a error throw err.
        if (err) throw err;
      })
      this.mySecondPackageView.display_array(editor.getCursorBufferPosition());
      this.modalPanel.show();
    }
  }

};
