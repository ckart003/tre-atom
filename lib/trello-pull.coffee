{CompositeDisposable} = require 'atom'


module.exports =
  subscriptions: null

  activate: ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'trello-pull:toggle': => @pull()

  deactivate: ->
    @subscriptions.dispose()

  pull: ->
 
