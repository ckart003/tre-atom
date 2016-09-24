'use babel';

export default class TreAtomView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-goat');

    // 1. Create the buttons
    var button_1 = document.createElement("button");
    button_1.innerHTML = "To Do";
    var button_2 = document.createElement("button");
    button_2.innerHTML = "In Progress";
    var button_3 = document.createElement("button");
    button_3.innerHTML = "Finished";



    // Create message element
    const message = document.createElement('div');

    //message.classList.add('button');
    this.element.appendChild(button_1);
    this.element.appendChild(button_2);
    this.element.appendChild(button_3);

    button_1.addEventListener ("click", function() {
      alert("To Do Card List");
    });
    button_2.addEventListener ("click", function() {
      alert("In Progress Card List");
    });
    button_3.addEventListener ("click", function() {
      alert("Finished Card List");
    });
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
