import React  from 'react';
import {  TouchableOpacity, Image } from 'react-native';
import { StackActions, SafeAreaView } from 'react-navigation';

import styles from './styles';
import homeNs from '../../assets/user-home-icon.png';
import homeSelected from '../../assets/user-home-icon-selected.png';
import profileNs from '../../assets/user-profile-icon.png';
import profileSelected from '../../assets/user-profile-icon-selected.png';
import searchNs from '../../assets/user-search-icon.png';
import searchSelected from '../../assets/user-search-icon-selected.png';
import activityNs from '../../assets/user-activity-icon.png';
import activitySelected from '../../assets/user-activity-icon-selected.png';
import videoNs from '../../assets/user-video-capture-icon.png';
import CurrentUser from '../../models/CurrentUser';
import utilities from "../../services/Utilities";

const tabConfig = {
    tab1: {
        rootStack: 'Home',
        childStack: 'HomeScreen',
        navigationIndex: 0
    },
    tab2: {
        rootStack: 'Search',
        childStack: 'SearchScreen',
        navigationIndex: null
    },
    tab3: {
        rootStack: 'CaptureVideo',
        childStack: 'CaptureVideo',
        navigationIndex: null
    },
    tab4: {
        rootStack: 'Users',
        childStack: 'UsersScreen',
        navigationIndex: 1
    },
    tab5: {
        rootStack: 'Profile',
        childStack: 'ProfileScreen',
        navigationIndex: 2
    }
};

let previousTabIndex = 0;

function onTabPressed(navigation, tab) {
    if (!CurrentUser.checkActiveUser()) return;
  
    if (tab.rootStack ==  "CaptureVideo" ) {
        utilities.handleVideoUploadModal();
        return;
    }

    if( tab.navigationIndex == undefined || tab.navigationIndex == null ) return ;

    if (previousTabIndex != tab.navigationIndex) {
        navigation.navigate(tab.rootStack);
    } else {
        try {
            if (utilities.getLastChildRoutename(navigation.state) !== tab.childStack) {
                navigation.dispatch(StackActions.popToTop());
            }
        } catch {
            console.log('Catch error');
        }
    }
}


const CustomTab = ({ navigation, screenProps }) => {
  previousTabIndex = navigation.state.index
   return ( <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab1)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab1.navigationIndex ? homeSelected : homeNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab2)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab2.navigationIndex ? searchSelected : searchNs}
        />
      </TouchableOpacity>
     <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab3)}>
       <Image
         style={[styles.tabElementSkipFont]}
         source={videoNs}
       />
     </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab4)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab4.navigationIndex ? activitySelected : activityNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab5)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab5.navigationIndex ? profileSelected : profileNs}
        />
      </TouchableOpacity>
    </SafeAreaView>)
};


export default CustomTab;
