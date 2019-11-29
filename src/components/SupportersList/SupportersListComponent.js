import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import User from '../Users/User';
import Pricer from '../../services/Pricer';
import reduxGetters from '../../services/ReduxGetters';
import EmptyList from '../EmptyFriendsList/EmptyList';
import CommonStyle from "../../theme/styles/Common";

class SupportersList extends PureComponent {
  constructor(props) {
    super(props);
  }

  getBtAmount(fromUser, toUserId) {
    return Pricer.getToBT(Pricer.getFromDecimal(reduxGetters.getUserContributionByStats(fromUser, toUserId)));
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User userId={item} amount={this.getBtAmount(item, this.props.userId)} />;
  };

  getEmptyComponent = () => {
    return !this.props.refreshing && <EmptyList displayText="You will see people supporting you here" />;
  };

  render() {
    return (
      <View style={CommonStyle.viewContainer}>
        <FlatList
          data={this.props.list}
          onEndReached={this.props.getNext}
          onRefresh={this.props.refresh}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={5}
          ListEmptyComponent={this.getEmptyComponent}
          ListFooterComponent={this.props.renderFooter}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default flatlistHOC(SupportersList);
