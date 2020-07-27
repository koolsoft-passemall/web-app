import { call, put, select, take } from 'redux-saga/effects';
import Config from '../../config';
import Question from '../../models/QuestionX';
import { callApi } from '../../services';
import * as Actions from '../actions/card';
import { GET_CARDS_BY_IDS, GET_CARDS_BY_PARENT_ID } from '../actions/types';
function getCardsByIdsSagaApi(ids) {
    return callApi({ url: '/data?type=get_cards_by_ids&ids=' + ids.toString(), params: null, method: 'post' });
}
export function getCardByParentIdForStudy(topicId) {
    return callApi({ method: 'post', url: '/data?type=get_cards_by_parent_id&parentId=' + topicId, params: {} });
}
export function getCardForTest(testsetting) {
    // 6225635760406528
    console.log("getCardForTest ", testsetting);
    return callApi({ url: Config.API_GET_CARDS_FOR_TEST_SETTING, params: Object.assign({}, testsetting.toJS()), method: "POST" });
}
function getCardsByParentIdSagaApi(parentId) {
    return callApi({ url: '/data?type=get_cards&id=' + parentId, params: null, method: 'post' });
}
function* getCardsByParentIdSaga() {
    try {
        let action = yield take(GET_CARDS_BY_PARENT_ID);
        let data = yield call(getCardsByParentIdSagaApi, action.params);
        let cards = new Array();
        if (data) {
            data.forEach((card) => cards.push(new Question(card)));
        }
        yield put(Actions.getCardsByParentIdSuccess(cards));
    }
    catch (e) {
        yield put(Actions.getCardsByParentIdFailure(e));
    }
}
export function* getCardsByIdsAPI(cardIds) {
    var _a;
    let questionState = yield select((state) => state.cardReducer);
    let cards = new Array();
    let cardMissIds = [];
    console.log("questionState ", questionState);
    if (questionState) {
        let mapCard = (_a = questionState.data) !== null && _a !== void 0 ? _a : {};
        cardIds.forEach((cardId) => {
            if (mapCard[cardId]) {
                let card = Question.fromJs(mapCard[cardId]);
                cards.push(card);
            }
            else {
                cardMissIds.push(cardId);
            }
        });
    }
    console.log("cardMissIds ", cardMissIds);
    if (cardMissIds.length > 0) {
        let data = yield call(getCardsByIdsSagaApi, cardMissIds);
        if (data) {
            data.forEach((card) => cards.push(Question.fromJs(card)));
        }
    }
    return cards;
}
function* getCardsByIdsSaga() {
    while (true) {
        try {
            let action = yield take(GET_CARDS_BY_IDS);
            let cards = yield call(getCardsByIdsAPI, action.params);
            yield put(Actions.getCardsByIdsSuccess(cards));
        }
        catch (e) {
            yield put(Actions.getCardsByIdsFailure(e));
        }
    }
}
export const cardsSaga = [
    getCardsByIdsSaga(),
    getCardsByParentIdSaga()
];
