import React, { PureComponent } from 'react';
import { Tab } from "native-base";
import {
  Text,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {withNavigation} from "react-navigation";

import Pagination from '../../services/Pagination';
import CurrentUser from '../../models/CurrentUser';
import inlineStyles from '../PostTabBar/style';
import DataContract from '../../constants/DataContract';
import reduxGetters from '../../services/ReduxGetters';
import DeleteVideo from "../CommonComponents/DeleteVideo";
import ReplyThumbnail from '../CommonComponents/VideoThumbnail/ReplyThumbnail';


class RepliesTabBar extends PureComponent {
  constructor(props){
    super(props);
    this.videoRepliesPagination = new Pagination( this._fetchUrlProfileReplies() );
    this.paginationEvent = this.videoRepliesPagination.event;
    this.state = {
      list :  this.videoRepliesPagination.getList(),
      refreshing : false,
      loadingNext: false
    }
  }

  _fetchUrlProfileReplies(){
    return `/users/${this.props.userId}/reply-history` ;
  }

  componentDidMount = () =>{
    this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
    this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
    this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
    this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
    this.paginationEvent.on("onNext" , this.onNext.bind(this) );
    this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
    this.videoRepliesPagination.initPagination();
  }

  componentWillUnmount(){
    this.paginationEvent.removeListener('onBeforeRefresh');
    this.paginationEvent.removeListener('onRefresh');
    this.paginationEvent.removeListener('onRefreshError');
    this.paginationEvent.removeListener('onBeforeNext');
    this.paginationEvent.removeListener('onNext');
    this.paginationEvent.removeListener('onNextError');
    if( this.props.refreshEvent) {
      this.props.refreshEvent.removeListener("refresh");
    }
  }

  beforeRefresh = ( ) => {
    this.props.beforeRefresh && this.props.beforeRefresh();
    this.onPullToRefresh();
    this.setState({ refreshing : true });
  }

  onPullToRefresh = () => {
    this.videoRepliesPagination.refresh();
  }

  onRefresh = ( res ) => {
    const list = this.videoRepliesPagination.getList()  ;
    this.props.onRefresh && this.props.onRefresh( list , res );
    this.setState({ refreshing : false , list : list });
  }

  onRefreshError = ( error ) => {
    this.setState({ refreshing : false });
  }

  beforeNext =() => {
    this.setState({ loadingNext : true });
  }

  onNext = ( res  ) => {
    this.setState({ loadingNext : false ,  list : this.videoRepliesPagination.getList() });
  }

  onNextError = ( error ) => {
    this.setState({ loadingNext : false });
  }

  getNext = () => {
    this.videoRepliesPagination.getNext();
  }

  refresh = () => {
    this.videoRepliesPagination.refresh();
  }

  _keyExtractor = (item, index) => `id_${item}`;

  removeVideo = (videoId, index) => {
    if (index > -1) {
      this.videoRepliesPagination.deleteItem(videoId , "payload.video_id");
      let array = [...this.state.list]; // make a separate copy of the array
      array.splice(index, 1);
      this.setState({list: array});
      this.props.onDelete && this.props.onDelete(array);
    }
  }

  _renderVideoReplyThumbnail= ( {item, index} )=> {
    const reply_detail_id = reduxGetters.getUserReplyId(item);
    this.fetchUrl = DataContract.replies.getUserReplyListApi(this.props.userId);
    return (<View style={{position: 'relative'}}>
      {reduxGetters.getCanDeleteReply( reply_detail_id ) && <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', top: 0, left: 0, zIndex: 1, alignItems: 'flex-end'}}
      >
        <View style={inlineStyles.deleteButton}>
          <DeleteVideo fetchUrl={DataContract.replies.getDeleteVideoReplyApi(reply_detail_id)}
                       removeVideo={ () => {this.removeVideo(reply_detail_id , index )}} />
        </View>
      </LinearGradient>}
      <ReplyThumbnail  payload={{reply_detail_id:reply_detail_id, user_id: this.props.userId }}  index={index} onVideoClick={() => {this.onVideoClick(index , item)}}/>
    </View>);
  }

  onVideoClick = (index , item)=>{
    const clonedInstance = this.videoRepliesPagination.fetchServices.cloneInstance();
    this.props.navigation.push("FullScreenReplyCollection", {
      "fetchServices" : clonedInstance,
      "currentIndex": index,
      "baseUrl": this.fetchUrl,
      "isUserReplyVideo" : true
    });
  }
  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  render(){
    return(
      <FlatList
        listKey={(item,index) => { index.toString()}}
        data = {this.state.list}
        onEndReached={this.getNext}
        onRefresh={this.refresh}
        keyExtractor={this._keyExtractor}
        refreshing={this.state.refreshing}
        onEndReachedThreshold={9}
        renderItem={this._renderVideoReplyThumbnail}
        ListFooterComponent={this.renderFooter}
        numColumns={2}
      >
      </FlatList>
    )
  }
}

export default withNavigation(RepliesTabBar);