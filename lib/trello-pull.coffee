{CompositeDisposable} = require 'atom'
express = require('express')
http = require('http')
app = express()
xhttp = require('XMLHttpRequest')
Trello = require('node-trello')
trello_config = require('./trello-config.json')
t=new Trello(trello_config.key,trello_config.token)

module.exports =
  subscriptions: null

  activate: ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'trello-pull:toggle': => @pull()

  deactivate: ->
    @subscriptions.dispose()

  pull: ->
