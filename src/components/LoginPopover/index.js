import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import firebase from 'react-native-firebase';

import TouchableButton from '../../theme/components/TouchableButton';
import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover } from '../../actions';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import twitterBird from '../../assets/twitter-bird.png';
import modalCross from '../../assets/modal-cross-icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import { WEB_ROOT } from '../../constants/index';
import AppConfig from '../../constants/AppConfig';

let TwitterAuthService;
import('../../services/TwitterAuthService').then((imports) => {
  TwitterAuthService = imports.default;
});

const mapStateToProps = ({ login_popover }) => ({
  show: login_popover.show
});

const btnPreText = 'Connect with Twitter';
const btnPostText = 'Connecting...';

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false,
      btnText: btnPreText
    };
    this.isTwitterConnecting = false;
  }

  componentWillUnmount() {
    this.state.disableLoginBtn = false;
    this.state.btnText = btnPreText;
    this.isTwitterConnecting = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && this.props.show !== prevProps.show) {
      this.setState({ disableLoginBtn: false, btnText: btnPreText });
      this.isTwitterConnecting = false;
    }
  }

  onSignUp = () => {
    this.setState({ disableLoginBtn: true, btnText: btnPostText });
    this.isTwitterConnecting = true;
    TwitterAuthService.signUp();
  };

  //Use this function if needed to handle hardware back handling for android.
  closeModal = () => {
    if (!this.isTwitterConnecting) {
      Store.dispatch(hideLoginPopover());
    }
    return true;
  };

  render() {
    return (
      <React.Fragment>
        {this.props.show && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
            onRequestClose={() => console.log('onRequestClose')}
          >
            <TouchableWithoutFeedback onPressIn={this.closeModal}>
              <View style={inlineStyles.parent}>
                <TouchableWithoutFeedback>
                  <View style={inlineStyles.container}>
                    <TouchableOpacity
                      onPress={this.closeModal}
                      style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        width: 38,
                        height: 38,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image source={modalCross} style={{ width: 19.5, height: 19 }} />
                    </TouchableOpacity>
                    <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 20 }} />
                    <Text
                      style={[
                        inlineStyles.desc,
                        {
                          fontWeight: '500',
                          marginBottom: 5
                        }
                      ]}
                    >
                      Meet the people shaping the crypto movement.
                    </Text>
                    <TouchableButton
                      TouchableStyles={[
                        Theme.Button.btnSoftBlue,
                        {
                          marginTop: 15,
                          flexDirection: 'row',
                          height: 55,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '85%'
                        },
                        this.state.disableLoginBtn ? Theme.Button.disabled : null
                      ]}
                      TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                      text={this.state.btnText}
                      onPress={this.onSignUp}
                      source={twitterBird}
                      imgDimension={{ width: 28, height: 22.5, marginRight: 8 }}
                      disabled={this.state.disableLoginBtn}
                    />
                    <View style={inlineStyles.tocPp}>
                      <Text style={{textAlign: 'center'}}>
                        <Text style={inlineStyles.termsTextBlack}>By signing up, you confirm that you agree to
                          our </Text>
                        <Text style={inlineStyles.termsTextBlue} onPress={multipleClickHandler(() => {
                          this.closeModal();
                          InAppBrowser.openBrowser(
                            `${WEB_ROOT}/terms`
                          );
                        })}>Terms of use </Text>
                        <Text style={inlineStyles.termsTextBlack}>and have read and agree to our </Text>
                        <Text style={inlineStyles.termsTextBlue} onPress={multipleClickHandler(() => {
                          this.closeModal();
                          InAppBrowser.openBrowser(
                              `${WEB_ROOT}/privacy`
                          );
                        })}>Privacy Policy</Text>
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export const LoginPopover = connect(mapStateToProps)(loginPopover);
export const LoginPopoverActions = {
  show: () => {
    Store.dispatch(showLoginPopover());
    let analyticsAction = AppConfig.routesAnalyticsMap.TwitterLogin;
    console.log('firebase.analytics().setCurrentScreen() ::', analyticsAction);
    firebase.analytics().setCurrentScreen(analyticsAction, analyticsAction);
  },
  hide: () => {
    Store.dispatch(hideLoginPopover());
  }
};
