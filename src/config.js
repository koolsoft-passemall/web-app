class Config {


    static USER_ID = 'kienxxx';
    static SECRET_KEY = "koolsoft-web";
    static TEST_MODE = false;
    static BASE_URL = `https://webappapi-dot-micro-enigma-235001.appspot.com/`;
     // staE_URL = `https://utestwebapi-dot-micro-enigma-235001.appspot.com`;
    static NULL_STRING = "";
    static API_GET_CARDS_BY_IDS = "/get-card-by-ids";
    static API_GET_CARDS_FOR_TEST_SETTING = "/data?type=get_cards_for_test";
    static HTTP_REQUEST_TIMEOUT = 30000;
    static HTTP_REQUEST_SUCCESSS = 200;
    static HTTP_REQUEST_ERROR = 500;
    static LIMIT_USER_RATING = 10;
    static GAME_STATUS_TESTING = 0;
    static WEAK_QUESTION = { id: 1, name: 'Weak Question', image: require('./resources/images/weak.svg').default };
    static MEDIUM_QUESTION = { id: 2, name: 'Medium Question', image: require('./resources/images/medium.svg').default };
    static STRONG_QUESTION = { id: 3, name: 'Strong Question', image: require('./resources/images/strong.svg').default };
    static ALL_FAMILIAR_QUESTION = { id: 4, name: 'All Familiar Question', image: require('./resources/images/test.svg').default };
    static YOUR_FAVORITE_QUESTION = { id: 5, name: 'Your Favorite Question', image: require('./resources/images/heart.svg').default };
    static LEVEL_QUESTION = [this.WEAK_QUESTION, this.MEDIUM_QUESTION, this.STRONG_QUESTION, this.ALL_FAMILIAR_QUESTION, this.YOUR_FAVORITE_QUESTION];
    static STUDY_GAME = 0;
    static TEST_GAME = 1;
    static REVIEW_GAME = 2;
    static GAME_STATUS_FAILED = -1;
    static GAME_STATUS_TESTING = 0;
    static GAME_STATUS_PASSED = 1;
    static QUESTION_NOT_ANSWERED = 0;
    static QUESTION_ANSWERED_INCORRECT = 1;
    static QUESTION_ANSWERED_CORRECT = 2;
    static QUESTION_ANSWERED_SKIP = 3;
    static START_STATUS = 0;
    static PLAYING_STATUS = 1;
    static FINISHED_STATUS = 2;
    static NEXT_PART_PROGRESS = 50;
    static TEST_TOTAL_QUESTION = 50;
    static TEST_ALLOW_MISTAKE = 15;
}
export default Config;
