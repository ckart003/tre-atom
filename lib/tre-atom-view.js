'use babel';

export default class TreAtomView {

  constructor(serializedState) {
    // Create main div element and two sub-div menus
    this.element = document.createElement('div');
    this.element2 = document.createElement('div');
    this.element2.id = "firstMenu";
    this.element3 = document.createElement('div');
    this.element3.id = "secondMenu";

    this.element.classList.add('atom-goat');

    // Create the board buttons
    var submitButton = document.createElement("button");
    submitButton.innerHTML = "submit";
    //Add sub-div to main div and buttons to this sub-div
    this.element.appendChild(this.element2);
    this.element2.appendChild(submitButton);


    //Create the buttons for board status
    var button_1 = document.createElement("button");
    button_1.innerHTML = "To Do";
    var button_2 = document.createElement("button");
    button_2.innerHTML = "In Progress";
    var button_3 = document.createElement("button");
    button_3.innerHTML = "Finished";

    //Add buttons to element3
    this.element.appendChild(this.element3);
    this.element3.appendChild(button_1);
    this.element3.appendChild(button_2);
    this.element3.appendChild(button_3);
    //Create variables for side panels
    this.element3.style.visibility='hidden';

    submitButton.addEventListener ("click", function() {
      alert("Submitted");
     //Hide board menue
     document.getElementById('firstMenu').style.visibility='hidden';
     //Show task menu
     document.getElementById('secondMenu').style.visibility='visible';

     button_1.addEventListener ("click", function() {
       alert("Finished Card List");
       document.getElementById('secondMenu').style.visibility='hidden';
     });
     button_2.addEventListener ("click", function() {
       alert("In Progress Card List");
       document.getElementById('secondMenu').style.visibility='hidden';
     });
     button_3.addEventListener ("click", function() {
       alert("Finished Card List");
       document.getElementById('secondMenu').style.visibility='hidden';
     });



      //Input box stuff
      //var newDiv =  document.createElement('div');
      // var inputBox = document.createElement('input');
      // inputBox.setAttribute("type","text");
      // newDiv.appendChild(inputBox);
      // document.getElementsByClassName('atom-goat')[0].appendChild(newDiv);
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
