import React, { Component } from 'react';
import UserVideoHistoryRow from "../../UserVideoHistory/UserVideoHistoryRow";
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import DeletedVideoInfo from '../DeletedEntity/DeletedVideoInfo';
import CommonStyles from "../../../theme/styles/Common";
import FlotingBackArrow from "../../CommonComponents/FlotingBackArrow";
import SafeAreaView from 'react-native-safe-area-view';
import { fetchVideo } from '../../../helpers/helpers';
import DataContract from '../../../constants/DataContract';

class VideoPlayer extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          headerBackTitle: null,
          header: null
        };
      };

    constructor(props){
        super(props);
        this.videoId =  this.props.navigation.getParam('videoId');
        this.state = {
          userId : reduxGetter.getVideoCreatorUserId(this.videoId) || null,
          isDeleted : false
        };
        this.refetchVideo();
        this.isActiveScreen = true;
    }

    componentDidMount(){
      this.didFocusSubscription = this.props.navigation.addListener('didFocus', (payload) => {
        this.isActiveScreen = true ;
      });

      this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
        this.isActiveScreen =  false ;
      });
    }

    componentWillUnmount(){
      this.onRefetchVideo = () => {};
      this.didFocusSubscription && this.didFocusSubscription.remove();
      this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
      return this.isActiveScreen;
    };

    refetchVideo = () => {
      if (this.state.isDeleted) return;
      fetchVideo( this.videoId , this.onRefetchVideo );
    };

    onRefetchVideo = ( res ) => {
      if(Utilities.isEntityDeleted(res)){
        this.setState({isDeleted: true});
        return;
      }
      const video_details = deepGet(res, `data.${DataContract.videos.videoDetailsKey}`),
            item = video_details[this.videoId];
      if( item ){
        this.setState({
          userId: item[DataContract.videos.creatorUserIdKey]
        })
      }
    };

    getPixelDropData = () => {
      return pixelParams = {
        p_type: 'single_video',
        p_name: this.videoId
      };
    }

    render() {
        if(this.state.isDeleted){
         return <DeletedVideoInfo/>
        }else{
          return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={CommonStyles.fullScreenVideoSafeAreaContainer}>
              <TopStatus />
              <UserVideoHistoryRow doRender={true} isActive={ true }  shouldPlay={this.shouldPlay}
                                    videoId={this.videoId} userId={this.state.userId} getPixelDropData={this.getPixelDropData}
                                 />
             <FlotingBackArrow />
            </SafeAreaView>
          )
        }
    }
}

export default  VideoPlayer ;
