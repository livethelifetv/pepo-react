import React, { PureComponent } from 'react';
import {View, Text, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';

import inlineStyles from './styles';

import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import Utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
import TextFormatter from '../CommonComponents/TextFormatter';
import ReduxGetters from '../../services/ReduxGetters';
import TimerIcon from '../../assets/created-timer-icon.png';
import { shortenedFromNow } from '../../helpers/timestampHandling';
import ReportVideo from "../CommonComponents/ReportVideo";

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
  }

  onLinkClick = () => {
    InAppBrowser.openBrowser(this.props.link);
  };

  navigateToUserProfile = () => {
    if(!this.props.isUserNavigate) return;
    if (Utilities.checkActiveUser()) {
        if (this.props.userId == CurrentUser.getUserId()) {
            this.props.navigation.navigate('ProfileScreen');
        } else {
            this.props.navigation.push('UsersProfileScreen', { userId: this.props.userId });
        }
    }
  };

  getTappedIncludesEntity = ( tag ) => {
    let tappedIncludesEntity = ReduxGetters.getTappedIncludesEntity(this.props.entityDescriptionId, tag);
    return tappedIncludesEntity;
  };

  render() {
    return (
      <View style={inlineStyles.bottomBg}>

          <View style={inlineStyles.bottomBgInner}>
          {!!this.props.userName &&(
            <View style={inlineStyles.handleWithTimerAndReportIcon}>
              <TouchableOpacity onPress={multipleClickHandler(() => this.navigateToUserProfile())}
                                pointerEvents={'auto'}
                                activeOpacity={0.9}
              >
                <View style={inlineStyles.handleTruncate}>
                  <Text ellipsizeMode={'tail'} numberOfLines={1} style={[inlineStyles.handle]} selectable={true} selectionColor={'#ff5566'}>
                    {/*ellipsizeMode ellipsizeMode ellipsizeMode ellipsizeMode*/}
                    {`@${this.props.userName}`}
                  </Text>
                  <Image style={inlineStyles.ctaIconSkipFont} source={TimerIcon}/>
                  <Text style={inlineStyles.timerTxt}>{shortenedFromNow(this.props.cts*1000)}</Text>
                </View>
              </TouchableOpacity>
              <ReportVideo userId={this.props.userId} entityId={this.props.entityId} entityKind={this.props.entityKind} />
            </View>)}
            {this.props.description ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'AvenirNext-Regular', textAlign: 'left' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >
                <TextFormatter text={this.props.description} getTappedIncludesEntity={this.getTappedIncludesEntity}
                        navigation={this.props.navigation}/>
              </Text>
            ) : (
                <React.Fragment />
              )
            }
          </View>

        {this.props.link ? (
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
             this.onLinkClick();
            })}
            pointerEvents={'auto'}
            activeOpacity={0.9}
          >
            <Text
              style={[{ fontSize: 13, paddingBottom: 10, fontFamily: 'AvenirNext-DemiBold', fontWeight: '700'}, inlineStyles.bottomBgTxt]}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {this.props.link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/\/$/, '')}
            </Text>
          </TouchableOpacity>
        ) : (
          <React.Fragment />
        )}
      </View>
    );
  };
}

BottomStatus.defaultProps = {
  isUserNavigate : true
};

export default BottomStatus;
