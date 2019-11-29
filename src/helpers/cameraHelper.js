import AppConfig from '../constants/AppConfig'
import NavigationService from "../services/NavigationService";
import Utilities from "../services/Utilities";
import CurrentUser from "../models/CurrentUser";
import { ostErrors } from "../services/OstErrors";
import Pricer from "../services/Pricer";
import ReduxGetters from "../services/ReduxGetters";
import Toast from  '../theme/components/NotificationToast';


// creatorUserId is mandatory as without it token holder address can not be accessed.
const getVideoReplyObject = (videoId, creatorUserId) => {
  return {
    videoType : AppConfig.videoTypes.reply,
    videoId: videoId,
    userId: creatorUserId,
    amount: ReduxGetters.getBtAmountForReply(videoId),
    videoReplyCount: ReduxGetters.getVideoReplyCount(videoId),
    isChargeble: ReduxGetters.isVideoIsChargeable(videoId),
    toTokenHolderAddress:  ReduxGetters.getUser( creatorUserId ).ost_token_holder_address
  };
};


const navigateToCamera = (videoId , userId , navigation) => {
  let activeTab = NavigationService.getActiveTab();
  let params = getVideoReplyObject ( videoId , userId);
  Utilities.handleVideoUploadModal(activeTab, navigation, params);
};

const replyPreValidationAndMessage = (videoId , userId) => {

  if(!videoId || !userId){
    console.warn("replyPreValidationAndMessage missing videoId - "  + videoId +   "or userId - " +  userId  );
    return false;
  }

  if(!CurrentUser.isUserActivated( true )){
    return false;
  }

  const isReplyAllowed = ReduxGetters.isReplyAllowed(videoId) , 
  isVideoUserActivated = Utilities.isUserActivated(ReduxGetters.getUserActivationStatus(userId))
   ;

  if( !isReplyAllowed || !isVideoUserActivated ){
    Toast.show({
      text: ostErrors.getUIErrorMessage("video_reply_not_allowed"),
      icon: 'error'
    });
    return false;
  }

  const requiredPepo = ReduxGetters.getBtAmountForReply(videoId);

  if(Pricer.getWeiToNumber(ReduxGetters.getBalance()) < Pricer.getWeiToNumber(requiredPepo)){
    Toast.show({
      text: ostErrors.getUIErrorMessage("video_reply_not_allowed_low_bal"),
      icon: 'error'
    });
    return false ;
  }

  return true;

}

export { getVideoReplyObject  , navigateToCamera  , replyPreValidationAndMessage}