'use babel';

import TreAtomView from './tre-atom-view';
import {
    CompositeDisposable
} from 'atom';
var Trello = require('node-trello');
var trello_config = require('./trello-config');
var t = new Trello(trello_config.key, trello_config.token);

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
             console.log("LENGTH IS :: "+res.length);
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
                  console.log("ITER :: "+i+" board_json id "+ board_json.id);
                  board_arr[i] = board_json
             }
             return board_arr;
        })
        .then(function(res){

             console.log("BOARD JSON");
             console.log(res);
             console.log("BOARD JSON END");
             var menu = document.getElementById('firstMenu');
             console.log(res.length);
             for(var i=0;i<res.length;i++){
                  var inputID = document.createElement('button');
               //    inputID.setAttribute('type','button');
                    inputID.setAttribute('name','board_sel');
                  inputID.innerHTML = res[i].name;
                  inputID.value = res[i].id;
                  alert(inputID.value);
                  menu.appendChild(inputID);
             }
             document.createElement('')
             console.log("---------------------------------");

             var listPromise = new Promise(
                  function(resolve,reject){
                       t.get("/1/boards/"+res[2]+"/lists", function(err,data){
                          if (err) throw(err);
                          console.log(data)
                          resolve(data);
                     })
                  }
             )


             return listPromise;

        }).then(function(res){
             t.get("/1/lists/"+res[0].id+"/cards", function(err,data){
                  if (err) throw(err);
                  console.log(data);
             })
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
