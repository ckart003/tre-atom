'use babel';

import TreAtomView from './tre-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  treAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.treAtomView = new TreAtomView(state.treAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.treAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tre-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.treAtomView.destroy();
  },

  serialize() {
    return {
      treAtomViewState: this.treAtomView.serialize()
    };
  },

  toggle() {
    console.log('TreAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
