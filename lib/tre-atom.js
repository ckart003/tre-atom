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
                t.get("/1/members/leonliang6/boards", function(err, data) {
                    if (err) throw (err);
                    resolve(data);
                })
            }
        )


        var board_arr, board_name_arr;
        board_arr = new Array();
        board_name_arr = new Array();

        promise.then(function(res) {
                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    var board_json = {
                        name: "",
                        id: "",
                        list: [{
                            id: "",
                            name: "",
                            cards: [{
                                card_id: "",
                                card_name: ""
                            }]
                        }]
                    };
                    board_json.id = res[i].id;
                    board_json.name = res[i].name;
                    board_arr[i] = board_json
                }
                return board_arr;
            })
            .then(function(res) {

                console.log(res);
                var menu = document.getElementById('firstMenu');

                for (var i = 0; i < res.length; i++) {
                    var inputID = document.createElement('button');
                    inputID.setAttribute('name', 'board_sel');
                    inputID.addEventListener('click', goToLists(res[i].id));
                    inputID.innerHTML = res[i].name;
                    inputID.value = res[i].id;
                    menu.appendChild(inputID);

                }

            })
            .catch(function(err) {
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

function goToLists(board_id) {
    return function() {
        document.getElementById('firstMenu').style.visibility = "hidden";
        document.getElementById('secondMenu').style.visibility = "visible";
        // alert(board_id);
        getLists(board_id).then(function(res) {
            var menu = document.getElementById('secondMenu');
            var menu = document.getElementById('secondMenu');
            var table = document.createElement('table');

            for (var i = 0; i < res.length; i++) {
                var inputID = document.createElement('button');
                inputID.setAttribute('name', 'list_sel');
                inputID.innerHTML = res[i].name;
                inputID.value = res[i].id;
                inputID.addEventListener('click', getCards(res[i].id));
                var tr = document.createElement('tr');
                tr.appendChild(inputID);
                table.appendChild(tr);
            }
            menu.appendChild(table);
        });
    }
}

var lists_json;

function getLists(board_id) {

    var listPromise = new Promise(
        function(resolve, reject) {
            t.get("/1/boards/" + board_id + "/lists", function(err, data) {
                if (err) throw (err);
                console.log(data);
                lists_json = data;
                resolve(data);
            })
        }
    )

    return listPromise;
}

function moveCard(card_id, destination, comment) {

    return function() {
        console.log(comment.value);
             t.put("/1/cards/" + card_id + "/idList", {
                 value: destination.value
             }, function(err, data) {
                 if (err) throw (err);
                 console.log(data);
            });

             t.post("/1/cards/" + card_id + "/actions/comments", {
                text: comment.value
             }, function(err, data) {
                if (err) throw (err);
                console.log(data);
             })
    }
}

function lastStage(card_id) {
    return function() {
        console.log("last stage :: ");
        console.log(lists_json);
        document.getElementById('firstMenu').style.display = "none";
        document.getElementById('secondMenu').style.display = "none";
        document.getElementById('thirdMenu').style.display = "none";
        document.getElementById('fourthMenu').style.visibility = "visible";
        var menu = document.getElementById('fourthMenu');
        var comment = document.createElement('input');
        comment.id = 'commentFinal';
        comment.setAttribute('type', 'text');
        //comment.setAttribute('value','default');
        var breakPoint = document.createElement('br');
        var drop_down = document.createElement('SELECT');
        for (var i = 0; i < lists_json.length; i++) {
            var opt = document.createElement('OPTION');
            opt.text = lists_json[i].name;
            opt.value = lists_json[i].id;
            drop_down.options.add(opt);
        }

        menu.appendChild(drop_down);
        menu.appendChild(breakPoint);
        menu.appendChild(comment);
        var submit = document.createElement("button");
        submit.innerHTML = "Submit";
        submit.style.backgroundColor = "#00CC66";
        submit.style.color = "black";
        submit.addEventListener('click', moveCard(card_id, drop_down, comment));
        menu.appendChild(submit);
    }
}

function getCards(lists_id) {
    //GET /1/lists/[idList]/cards
    return function() {
        var cardPromise = new Promise(
                function(resolve, reject) {
                    t.get("/1/lists/" + lists_id + "/cards", function(err, data) {
                        if (err) throw (err);
                        console.log(data)
                        resolve(data);
                    })
                }
            )
            // return cardPromise;
            document.getElementById('firstMenu').style.display = "none";
            document.getElementById('secondMenu').style.display = "none";
        document.getElementById('thirdMenu').style.visibility = "visible";
        cardPromise.then(function(res) {
            var menu = document.getElementById('thirdMenu');
            var table = document.createElement('table');
            for (var i = 0; i < res.length; i++) {
                var inputID = document.createElement('button');
                inputID.setAttribute('name', 'card_sel');
                inputID.innerHTML = res[i].name;
                inputID.value = res[i].id;
                inputID.addEventListener('click', lastStage(res[i].id));
                var tr = document.createElement('tr');
                tr.appendChild(inputID);
                table.appendChild(tr);
            }

            menu.appendChild(table);
        });

    }
}
