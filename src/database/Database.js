const database_name = './Reactoffline.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;
import SQLite from 'react-native-sqlite-storage';
import {AsyncStorage} from 'react-native';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class Database {
  db = null;
  initDB() {
    return new Promise(resolve => {
      console.log('Plugin integrity check ...');
      SQLite.echoTest().then(() => {
        console.log('Opening database ...');
        SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size,
        )
          .then(DB => {
            this.db = DB;

            //-------------Delete all tables in SQLite-----------------
            // DB.transaction(tx => {
            //     tx.executeSql("drop table if exists `my_profile1`");
            //     tx.executeSql("drop table if exists `daily_track`");
            //     tx.executeSql("drop table if exists `weight_logs`");
            // })

            // return;
            //-------------------------------------------------------

            console.log('Database OPEN');

            this.db
              .executeSql(
                'SELECT * FROM my_profile1 order by `date` desc limit 1',
              )
              .then(result => {
                console.log('My profile table exists', result[0]);
                if (
                  result &&
                  result[0] &&
                  result[0].rows &&
                  result[0].rows.length === 1
                ) {
                  let data = result[0].rows.item(0);
                  console.log('My current profile is ', data);
                  global.myprofile = data;
                  if (data.gender === 0) {
                    global.myprofile.gender = 'Male';
                  } else if (data.gender === 1) {
                    global.myprofile.gender = 'Female';
                  } else {
                    global.myprofile.gender = 'Not to mention';
                  }
                  global.myprofile.activityLevel =
                    parseInt(Math.random() * 10000, 10) % 6;
                  global.initialLoading = true;
                  AsyncStorage.getItem(
                    'weighinNotificationDay',
                    (_err, dayOfWeek) => {
                      global.myprofile.weighinNoficationDay = dayOfWeek;
                    },
                  );
                  console.log('Get the initial data');
                }
              })
              .catch(error => {
                console.log('My profiel table creation failed');
                this.db.executeSql(
                  'CREATE TABLE IF NOT EXISTS my_profile1 (userID integer, gender integer, calorieGoal real, weight real, weight_date text, height real, age integer, email text, name text, date text, activityLevel integer)',
                );
              })
              .catch(error => {
                console.log('Database 58, ', error);
              });

            this.db
              .executeSql('SELECT 1 FROM daily_track LIMIT 1')
              .then(() => {
                console.log('DATABASE - daily_track table is available');
              })
              .catch(error => {
                this.db.executeSql(
                  'CREATE TABLE IF NOT EXISTS daily_track (user_id integer, `date` varchar (35), `data` text)',
                );
              })
              .catch(error => {
                console.log('Database 66, ', error);
              });

            this.db
              .executeSql('SELECT 1 FROM weight_logs LIMIT 1')
              .then(() => {
                console.log('DATABASE - weight_logs table is available');
              })
              .catch(error => {
                this.db.executeSql(
                  'CREATE TABLE IF NOT EXISTS weight_logs (id integer primary key autoincrement, `date` text, user_id integer, weight real)',
                );
              })
              .catch(error => {
                console.log('Database 74, ', error);
              });
          })
          .catch(error => {
            console.log('echoTest failed - plugin not functional');
          });
      });
    });
  }

  getWeightLogs(resolve) {
    this.db
      .executeSql(
        'select * from weight_logs where user_id=' + global.myprofile.userID,
      )
      .then(result => {
        console.log('All Weights:', result[0]);
      });
  }
}
