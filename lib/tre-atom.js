'use babel';

import TreAtomView from './tre-atom-view';
import {
    CompositeDisposable
} from 'atom';
var Trello = require('node-trello');
var trello_config = require('./trello-config');
var t = new Trello(trello_config.key, trello_config.token);
// var $ = require('jquery');

export default {

    treAtomView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {

        var promise = new Promise(
            function(resolve, reject) {
                t.get("/1/members/leonliang6/boards", function(err,data){
                     if (err) throw(err);
                     resolve(data);
                })
            }
        )


        var board_arr,board_name_arr;
        board_arr = new Array();
        board_name_arr = new Array();

        promise.then(function(res){
             console.log(res);
             for(var i=0;i<res.length;i++){
                  var board_json = {
                       name: "",
                       id: "",
                       list:[{
                            id:"",
                            name:"",
                            cards:[{
                                 card_id:"",
                                 card_name:""
                            }]
                       }]
                  };
                  board_json.id = res[i].id;
                  board_json.name = res[i].name;
                  board_arr[i] = board_json
             }
             return board_arr;
        })
        .then(function(res){

             console.log(res);
             var menu = document.getElementById('firstMenu');

             for(var i=0;i<res.length;i++){
                  var inputID = document.createElement('button');
                  inputID.setAttribute('name','board_sel');
                    inputID.addEventListener('click',goToLists());
                  inputID.innerHTML = res[i].name;
                  inputID.value = res[i].id;
                  menu.appendChild(inputID);

             }

        })
        .catch(function(err){
             console.log("ERROR " + err);
        })


        this.treAtomView = new TreAtomView(state.treAtomViewState);
        this.modalPanel = atom.workspace.addRightPanel({
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

function goToLists(){
     return function(){
          document.getElementById('firstMenu').style.visibility = "hidden";
          document.getElementById('secondMenu').style.visibility = "visible";
     }
}

function getLists(board_id){

     var listPromise = new Promise(
          function(resolve,reject){
              t.get("/1/boards/"+board_id+"/lists", function(err,data){
                  if (err) throw(err);
                  console.log(data)
                  resolve(data);
             })
          }
     )

     return listPromise;
}

function moveCard(card_id,destination){
     // PUT /1/cards/[card id or shortlink]/idList
     t.put("/1/cards/"+card_id+"/lists", { value: destination },function(err,data){
         if (err) throw(err);
         console.log(data)
         resolve(data);
    })
}

function getCards(lists){
     var cards_arr = new Array();
     for(var i = 0 ; i<lists.cards.length; i++){
          cards_arr[i] = lists.cards[i];
     }
     return cards_arr
}
