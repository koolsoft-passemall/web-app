import { Grid } from '@material-ui/core';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { showImageDialog } from '../redux/actions/appValue';
import Image from './Image';
import { useParams } from 'react-router-dom';
export var TextContentType;
(function (TextContentType) {
    TextContentType[TextContentType["question"] = 1] = "question";
    TextContentType[TextContentType["answer"] = 2] = "answer";
    TextContentType[TextContentType["explanation"] = 3] = "explanation";
})(TextContentType || (TextContentType = {}));
const QuestionContentPanel = ({ content, image = '', type = TextContentType.question, showImageDialog, appInfoState }) => {
    let { appNameId } = useParams();
    let { bucket } = appInfoState.data[appNameId !== null && appNameId !== void 0 ? appNameId : ''];
    bucket = bucket !== null && bucket !== void 0 ? bucket : '';
    console.log("QuestionContentPanel bucket ", bucket);
    content = content.replace(/\n/g, "<br/>").replace(/\\u(....)/g, "&#x$1;");
    if (type === TextContentType.question) {
        return React.createElement(TextContentQuestion, { content: content, image: image, showImageDialog: showImageDialog, type: type, bucket: bucket });
    }
    return React.createElement(TextContent, { content: content, type: type, bucket: bucket });
};
const getUrlImage = (bucket, name) => {
    return 'https://storage.googleapis.com/micro-enigma-235001.appspot.com/' + bucket + '/images/' + name;
};
const TextContent = ({ content, type, bucket }) => {
    let result = content.split('$').map((str) => {
        if (isImage(str)) {
            let size = getSizeImage(str);
            return '<img style="cursor:pointer;display:inline-block;vertical-align:middle" alt="" src="' + getUrlImage(bucket, str) + '" width="' + size.width + '" height="' + size.height + '" />';
        }
        return str;
    }).join('');
    return (React.createElement("div", { style: type == TextContentType.explanation ? { marginBottom: '10px' } : {} }, ReactHtmlParser(result)));
};
const TextContentQuestion = ({ content, image, showImageDialog, type, bucket }) => {
    if (!image) {
        if (hasImage(content)) {
            return React.createElement(TextContent, { content: content, type: type, bucket: bucket });
        }
        return (React.createElement("div", null, ReactHtmlParser(content)));
    }
    let imageUrl = getUrlImage(bucket, image);
    return (React.createElement(Grid, { container: true, direction: "row", alignItems: "flex-start", style: { marginBottom: '10px' } },
        React.createElement(Grid, { item: true, xs: 9 }, ReactHtmlParser(content)),
        React.createElement(Grid, { item: true, xs: 3 },
            React.createElement(Image, { className: "image-in-question", width: "100%", src: imageUrl, alt: "", onClick: () => showImageDialog(imageUrl) }))));
};
function hasImage(str) {
    return (!!str) && (str.includes(".png") || str.includes(".jpg")
        || str.includes(".gif") || str.includes(".tiff") || str.includes(".bmp"));
}
function isImage(str) {
    return (!!str) && (str.endsWith(".png") || str.endsWith(".jpg")
        || str.endsWith(".gif") || str.endsWith(".tiff") || str.endsWith(".bmp"));
}
function getSizeImage(str) {
    let i1 = str.indexOf('_'), i2 = str.lastIndexOf('.');
    if (i1 > -1 && i2 > -1) {
        let sizeStr = str.substring(i1, i2);
        let i3 = sizeStr.indexOf('_w'), i4 = sizeStr.lastIndexOf('_h');
        let width = sizeStr.substring(i3 + 2, i4);
        let height = sizeStr.substring(i4 + 2, sizeStr.length);
        return { width: width + 'px', height: height + 'px' };
    }
    return { width: '50px', height: '50px' };
}
const mapStateToProps = (state, ownProps) => {
    return {
        appInfoState: state.appInfoState
    };
};
const mapDispatchToProps = {
    showImageDialog: (url) => showImageDialog(url),
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionContentPanel);
