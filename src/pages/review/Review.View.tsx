import { Grid, IconButton } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { Component, FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShowImage } from '../../components/Dialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Image from '../../components/Image';
import { FixedContainer, LoadingWidget, MainWidget } from '../../components/Widgets';
import Config from '../../config';
import ReviewProgress from '../../models/ReviewProgress';
import { scrollToTop, setSEOContent } from '../../models/Utils';
import { getAppInfo } from '../../redux/actions';
import { getAllCardProgress } from '../../redux/actions/cardProgress';
import { AppState } from '../../redux/appstate';
import { AppInfoState } from '../../redux/reducers/appInfo';
import { QuestionProgressState } from '../../redux/reducers/cardProgress';
import '../../resources/scss/game.scss';
import '../../resources/scss/main.scss';
import '../../resources/scss/review.scss';
import { checkLoadedReceiveProps } from '../../utils';
import { QuestionsPanelTS } from '../game/Game.ViewTS';
import ReactGA from 'react-ga';

const ReviewViewScreen: FunctionComponent<({ 
    getAppInfo: any,
    appInfoState: AppInfoState
    })> = ({
    getAppInfo,
    appInfoState
    }) => {
    let { appNameId, screen } = useParams();
    let topicId: number = -1;
    if(screen){
        let offset = screen.lastIndexOf('-') + 1;
        topicId = offset > -1 ? parseInt(screen.substring(offset, screen.length)) : -1;
    }
    appNameId = appNameId ?? '';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        getAppInfo(appNameId);
        if(isMobile){
            scrollToTop();
        }
    }, [getAppInfo, appNameId, isMobile]);
    let appInfo = appInfoState.data[appNameId];
    useEffect(() => {
        if(appInfo){
            setSEOContent({
                title: appInfo.title,
                description: appInfo.description,
                keywords: appInfo.keywords,
                icon: appInfo.icon
            });
            ReactGA.pageview('/reviewpage/' + appInfo.title);
        }
    }, [appInfo]);
    if(!appInfo){
        return <LoadingWidget />
    }
    return (
        <ReviewView appInfo={appInfo} topicId={topicId} isMobile={isMobile} />
    );
}

class ReviewViewScreenUI extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            appInfo: props.appInfo,
            levelId: -1,
            questionIds: null,
            showReview: false,
            isMobile: props.isMobile
        }
    }

    componentDidMount() {
        this.props.getAllCardProgress();
    }

    componentWillReceiveProps(nextProps: any) {
        if(!checkLoadedReceiveProps(this.props.cardProgressReducer, nextProps.cardProgressReducer)){
            let reviewProgress: ReviewProgress = getReviewProgress(this.props.cardProgressReducer);
            if(this.state.levelId == -1){
                let levelIdSelected: number = reviewProgress.getCurrentSelectedId();
                this.setState({
                    levelId: levelIdSelected,
                    questionIds: reviewProgress.getQuestionsIdsByLevelId(levelIdSelected)
                });
            }
        }
    }
    
    render() {
        let reviewProgress: ReviewProgress = getReviewProgress(this.props.cardProgressReducer);
        if(!reviewProgress){
            return <LoadingWidget color={null} />;
        }
        let levelIdSelected: number = -1;
        let questionIds: Array<number> = new Array<number>();
        if(this.state.levelId == -1){
            levelIdSelected = reviewProgress.getCurrentSelectedId();
            questionIds = reviewProgress.getQuestionsIdsByLevelId(levelIdSelected);
            // this.state.levelId = levelIdSelected;
            // this.state.questionIds = questionIds;
            // this.setState({
            //     levelId: levelIdSelected,
            //     questionIds: questionIds
            // })
        } else {
            levelIdSelected = this.state.levelId;
            questionIds = this.state.questionIds;
        }
        console.log("levelSelected ", levelIdSelected, 'questionIds', questionIds);
        return (
            <MainWidget className={'review-page'}>
                <Header />
                <FixedContainer className={'review-page-content' + (this.state.isMobile && this.state.showReview ? ' show-review' : '')}>
                    <Grid
                    container
                    direction="row"
                    spacing={this.state.isMobile ? 0 : 3}
                    >
                        <Grid className="left-panel" item xs={12} sm={12} md={4} 
                            style={this.state.isMobile ? {display: this.state.showReview ? 'none' : 'block'} : {}}>
                            <LevelQuestionPanel 
                                activeId={levelIdSelected} 
                                gameProgress={reviewProgress} 
                                onSelected={(item: any) => {
                                    this.setState({
                                        levelId: item.id,
                                        questionIds: reviewProgress.getQuestionsIdsByLevelId(item.id),
                                        showReview: true
                                    });
                                }} />
                        </Grid>
                        <Grid className="right-panel" item xs={12} sm={12} md={8}
                            style={this.state.isMobile ? {display: !this.state.showReview ? 'none' : 'block'} : {}}>
                            {this.state.isMobile && this.state.showReview ? <Grid container alignItems="center" >
                                <IconButton onClick={() => {
                                    this.setState({
                                        showReview: false
                                    })
                                }}><ArrowBackIcon /></IconButton>
                                <span>{Config.LEVEL_QUESTION.map((item) => {
                                    if(this.state.levelId === item.id){
                                        return item.name;
                                    }
                                    return '';
                                })}</span>
                            </Grid> : ''}
                            { 
                                questionIds.length > 0 ? <QuestionsPanelTS
                                    appInfo={this.state.appInfo}
                                    className="question-view-study-game"
                                    examId={-1}
                                    gameType={Config.REVIEW_GAME}
                                    questionIds={questionIds}
                                /> : <div className="empty-question-panel">Empty question!</div>
                                // <ReviewQuestionPanel questions={questions} questionProgress={questionProgress} />
                            }
                        </Grid>
                    </Grid>
                </FixedContainer>
                <Footer />
                <ShowImage />
            </MainWidget>
        );
    }
}

const LevelQuestionPanelUI = (props: any) => {
    // const [gameProgress, setGameProgress] = useState(props?.gameProgress);
    // useEffect(() => {
    //     let gameProgress = new GameProgress(Object.values(props.cardProgressReducer.data));
    //     setGameProgress(gameProgress);
    //     console.log("LevelQuestionPanelUI props.cardProgressReducer", gameProgress);
    // }, [props.cardProgressReducer]);
    let gameProgress: ReviewProgress = props?.gameProgress;
    let onSelected = props.onSelected ?? function(){console.error("onSelected null")};
    // console.log("LevelQuestionPanel gameProgress", gameProgress);
    return (
        <div className="level-question-panel">
            {
                Config.LEVEL_QUESTION.map((item: any) => {
                    let totalQuestion: number = gameProgress ? gameProgress.getTotalQuestionByLevelId(item.id) : 0;
                    return <LevelQuestionItem 
                        active={props.activeId === item.id} 
                        item={item} 
                        totalQuestion={totalQuestion} 
                        key={'level-question-item-' + item.id}
                        onSelected={onSelected}
                        />;
                })
            }
        </div>
    );
}

const LevelQuestionItem: FunctionComponent<({ item: any, totalQuestion: number, active: boolean, onSelected: any })> = ({item, totalQuestion, active, onSelected}) => {
    totalQuestion = totalQuestion ? totalQuestion : 0;
    return (
        <div className={"level-question-item" + (active ? " active" : "")} onClick={() => onSelected(item)}>
            <Grid
            container
            direction="row"
            alignItems="center"
            >
                <div style={{'width': 'calc(100% - 40px)'}}>
                    <label>{item.name}</label>
                    <div className="question-num">{totalQuestion} questions</div>
                </div>
                <div style={{'width': '40px'}}>
                    <Image src={item.image} width='25px' height="25px" />
                </div>
            </Grid>
        </div>
    );
}

function getReviewProgress(cardProgressState: QuestionProgressState) : ReviewProgress | any {
    if(cardProgressState && cardProgressState.data){
        return new ReviewProgress(Object.values(cardProgressState.data));
    }
    return null;
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    console.log("CHANGE CHANGE CHANGE ", Object.assign({}, state));
    return {
        cardReducer: state.cardReducer,
        cardProgressReducer: state.cardProgressReducer,
        ...ownProps
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    getAllCardProgress: () => dispatch(getAllCardProgress()),
});

const LevelQuestionPanel = connect(mapStateToProps, null)(LevelQuestionPanelUI);
const ReviewView = connect(mapStateToProps, mapDispatchToProps)(ReviewViewScreenUI);

const mapStateToPropsMain = (state: AppState, ownProps: any) => {
    return {
        appInfoState: state.appInfoState,
        ...ownProps
    };
}

const mapDispatchToPropsMain = (dispatch: any) => ({
    getAppInfo: (appNameId: string) => dispatch(getAppInfo(appNameId))
});

export default connect(mapStateToPropsMain, mapDispatchToPropsMain)(ReviewViewScreen);