const ConfigData = {
  TAB_DASHBOARD: 0,
  TAB_STATS: 1,
  TAB_TRACK: 2,
  TAB_SUGGESTED: 3,
  TAB_PREFERENCE: 4,
  TAB_DAILYGOALS: 10,
  TAB_MYCOACH: 11,
  TAB_HELP: 12,
  TAB_SEARCH: 20,
  //   SERVER_HOST: 'http://192.168.0.120:8000/',
  SERVER_HOST: 'http://34.207.9.196:50569/',
  ALERT: {
    REGISTER_BREAKFAST: "You didn't register the breakfast yet.",
    REGISTER_LUNCH: "You didn't register the lunch yet.",
    REGISTER_DINNER: "You didn't register the dinner yet.",
    REGISTER_MEAL: "You didn't register the meal yesterday.",
    NOT_LOGGED_IN: "You haven't logged in for the last 24 hours.",
    GOING_OVER_CALORIE: "You're going over the calorie intake yesterday.",
    CANT_REACH_TO_CALORIE:
      'You failed to meet the acceptable caloric intake yesterday.',
    WEEKLY_WEIGHIN: 'Please confirm that you recorded the weekly weigh-in.',
    MONTHLY_WEIGHIN: 'Please confirm that you recorded the monthly weigh-in.',
  },
};

export default ConfigData;
