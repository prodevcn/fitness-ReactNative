const Realm = require('realm');

class UserProfile { }
UserProfile.schema = {
    name: "UserProfile",
    primaryKey: 'email',
    properties: {
        email: 'string',
        name: { type: 'string', default: '' },
        created_date: { type: 'string', default: '' },
        phoneno: { type: 'string', default: '' },
        address: { type: 'string', default: '' },
        photo: { type: 'string', default: '' },
        age: { type: 'int', default: 0 },
        gender: { type: 'string', default: '' },
        location: { type: 'string', default: '' },
        goalCalorie: { type: 'string', default: '' },
        unit_weight: { type: 'int', default: 0 },
        unit_height: { type: 'int', default: 0 },
        activityLevel: { type: 'int', default: 0 },
    }
};

class WeightDailyLog { }
WeightDailyLog.schema = {
    name: "WeightDailyLog",
    properties: {
        date: 'string',
        weight: 'string'
    }
}

class WeightLogs { }
WeightLogs.schema = {
    name: "WeightLogs",
    primaryKey: 'user_email',
    properties: {
        user_email: 'string',
        weights: 'WeightDailyLog[]'
    }
}

class DailyTrack { }
DailyTrack.schema = {
    name: "DailyTrack",
    properties: {
        user_email: 'string',
        date: 'string',
        dinners: 'string'
    }
}
global.realm = null;

Realm.open({ schema: [DailyTrack, UserProfile, WeightLogs, WeightDailyLog] }).then(realm => {
    global.realm = realm;
})

module.exports = Realm;