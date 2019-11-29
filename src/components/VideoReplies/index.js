import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated ,TouchableWithoutFeedback
} from 'react-native';

import {getBottomSpace, ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';

import pepoIcon from "../../assets/pepo-tx-icon.png";
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import ReplyCollection from '../ReplyCollection';
import NavigationService from "../../services/NavigationService";
import utilities from "../../services/Utilities";

import SlidingUpPanel from "../CommonComponents/SlidingUpPanel";
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';

import { getInset } from 'react-native-safe-area-view';
import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';
import Pricer from "../../services/Pricer";
import {getVideoReplyObject, replyPreValidationAndMessage} from "../../helpers/cameraHelper";
import VideoReplyIcon from '../../assets/reply_video_icon.png';

const { width, height } = Dimensions.get('window');
const landScape = width > height;
const topPadding = getInset('top', landScape);
const bottomPadding = getInset('bottom', landScape);
const bottomReplyViewHeight = isIphoneX() ? 89 : 54;
const listBottomPadding = height - (height/1.5)+bottomReplyViewHeight ;

const bottomSpace = getBottomSpace([true]);

class VideoRepliesScreen extends PureComponent {

    static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
        header: null,
        headerBackTitle: null,
        gesturesEnabled: false
      };
    };

    constructor(props){
      super(props);
        this.userId = props.navigation.getParam('userId');
        this.videoId = props.navigation.getParam('videoId');
        this.fetchUrl = DataContract.replies.getReplyListApi(this.videoId);
        this.initialHeight =  height/1.5;
        this.animatedValue = new Animated.Value(this.initialHeight) ;
        this.listener = null;
        this.panelAnimateTimeOut = 0 ;


      this.state = {
        showBackdrop : false,
        addRepliesVisible : true,
        videoUploaderVisible: false,
        currentHeight : this.initialHeight,
        videoReplyCount : ReduxGetters.getVideoReplyCount(this.videoId)
      }
    }

    componentDidMount(){
      this.listener = this.animatedValue.addListener(this.onAnimatedValueChange);
      setTimeout(()=> {
        this.setState({
          showBackdrop: true,
          videoUploaderVisible: ReduxGetters.getVideoProcessingStatus()
        });

      }, 300)
      videoUploaderComponent.on('show', this.showVideoUploader);
      videoUploaderComponent.on('hide', this.hideVideoUploader);
    }

    componentWillUnmount() {
      this.onAnimatedValueChange= () => {};
      this.animatedValue.removeListener(this.listener);
      videoUploaderComponent.removeListener('show' , this.showVideoUploader , this);
      videoUploaderComponent.removeListener('hide' , this.hideVideoUploader , this);
    }

    showVideoUploader = () => {
      this.setState({
        videoUploaderVisible: true
      });
    };

    hideVideoUploader = ( otherStates, callback ) => {
      otherStates = otherStates || {};
      this.setState({
        ...otherStates,
        videoUploaderVisible: false
      }, callback);
    };

    onAnimatedValueChange = ({ value }) => {
      clearTimeout(this.panelAnimateTimeOut);
      this.panelAnimateTimeOut =  setTimeout(()=> {
        if( value < 10){
          this.hideVideoUploader({
            addRepliesVisible: false
          },() => {
            this.props.navigation.goBack();
          });
        }
      } , 10)
    };

    onCrossIconClick = () => {
      this._panel.hide();
    };

  getUploadingText = () => {
    let videoType = ReduxGetters.getRecordedVideoType();
    if (videoType === 'post'){
      return "Uploading Video";
    } else if (videoType === 'reply'){
      return "Posting reply";
    }
  }
  ;

    openCamera = () => {
      if( replyPreValidationAndMessage( this.videoId , this.userId ) ){
        let activeTab = NavigationService.getActiveTab();
        let params =  getVideoReplyObject ( this.videoId , this.userId) ;
        utilities.handleVideoUploadModal(activeTab, this.props.navigation, params);
      }
    }

    onData = ( data ) => {
        this.dataLoaded = true;
    }

    getWrapViewStyles = () => {
      let wrapStyles = {};
      if ( !this.state.addRepliesVisible ) {
        wrapStyles.display = "none";
      }
      return wrapStyles;
    };

    onRefresh = ()=> {
      this.setState({
        videoReplyCount : ReduxGetters.getVideoReplyCount(this.videoId)
      })
    };

    render(){
        return (
          <React.Fragment>
            {this.userId && this.state.videoUploaderVisible && (
                <VideoLoadingFlyer
                  componentHeight={46}
                  componentWidth={46}
                  sliderWidth={170}
                  containerStyle={{
                    ...ifIphoneX(
                      {
                        top: 60
                      },
                      {
                        top: 30
                      }
                    ),
                    left: 10,
                    zIndex: 9
                  }}
                  displayText={this.getUploadingText()}
                  extendDirection="right"
                  extend={true}
                  id={3}
                />
              )}
              <SlidingUpPanel ref={c => (this._panel = c)}
                  containerStyle={{zIndex: 99}}
                  animatedValue={this.animatedValue}
                  onMomentumDragEnd={(value) => {
                    this.setState({
                      currentHeight : value
                    })

                  }}
                  ref={c => (this._panel = c)}
                  draggableRange={{
                    top: height - topPadding,
                    bottom: 0
                  }}
                  showBackdrop={this.state.showBackdrop}
                  snappingPoints={[0, this.initialHeight, height]}>
                {dragHandler => (
                  <React.Fragment>
                    <View style={[inlineStyles.container, this.getWrapViewStyles()]}>
                      <View style={inlineStyles.dragHandler} {...dragHandler}>
                        <TouchableOpacity onPress={this.onCrossIconClick} style={[inlineStyles.iconWrapper]} >
                          <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
                        </TouchableOpacity>

                        <View style={inlineStyles.repliesTxt}>
                          <Text numberOfLines={1} style={inlineStyles.headerText}>
                            {this.state.videoReplyCount} Repl{this.state.videoReplyCount > 1 ? 'ies' : 'y'}
                          </Text>
                          {/*<Text style={inlineStyles.headerSubText}>Send a reply with{' '}*/}
                          {/*<Image style={{height: 10, width: 10}} source={pepoIcon} />*/}
                          {/*{ Pricer.getToBT(Pricer.getFromDecimal(ReduxGetters.getBtAmountForReply(this.videoId )), 2)}</Text>*/}
                        </View>
                      </View>
                      <ReplyCollection  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl}
                                        onData={this.onData}
                                        listBottomPadding={this.state.currentHeight > this.initialHeight? topPadding+bottomPadding+bottomReplyViewHeight : listBottomPadding}
                                        onRefresh={this.onRefresh}
                      />
                    </View>
                  </React.Fragment>

                )}
              </SlidingUpPanel>
              {this.state.addRepliesVisible && (
                 <TouchableWithoutFeedback onPress={this.openCamera}>
                 <View style={inlineStyles.addReplyView}>
                   <View style={inlineStyles.addReplyInnerView}>
                     <Image source={VideoReplyIcon} style={inlineStyles.addReplyImageDimensionSkipFont}></Image>
                     <Text style={inlineStyles.addReplyText}>
                       Add a reply...
                     </Text>
                   </View>
                 </View>
               </TouchableWithoutFeedback>
              )}
          </React.Fragment>
        );
    }

}


export default VideoRepliesScreen;

