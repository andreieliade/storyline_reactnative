import Realm from 'realm'

class ConversationMarker extends Realm.Object {}
ConversationMarker.schema = {
    name: 'ConversationMarker',
    primaryKey: 'id',
    properties: {
        id: 'string',
        title: 'string',
        seriesCurrent: 'int',
        seriesTotal: 'int',
        imgURL: 'string',
        readCount: 'int',
        readIndex: {type: 'int', default: 1},
        authorName: 'string',
        authorID: 'string',
        lastOpened: 'date',
    },
}

class BatteryState extends Realm.Object {}
BatteryState.schema = {
    name: 'BatteryState',
    primaryKey: 'id',
    properties: {
      id: 'string',
      started: {type: 'bool', default: false},
      lowBatterystartDate: {type: 'date', optional: true},
      chargeAmount: {type: 'int', default: 0},
    },
}


export default new Realm({schema: [ConversationMarker, BatteryState]})
