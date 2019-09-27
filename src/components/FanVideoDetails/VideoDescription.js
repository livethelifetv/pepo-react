import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import inlineStyles from './styles';
import TagsInput from '../CommonComponents/TagsInput';

class VideoDescription extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
  }

  onChangeValue = (value) => {
    this.setState({
      value
    });
    this.props.onChangeDesc(value);
  };

  submitEvent = () => {};

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TagsInput
          horizontal={false}
          initialValue={this.props.initialValue}
          onChangeVal={this.onChangeValue}
          placeholderText="Add a description. You can include #tags."
          submitEvent={this.submitEvent}
          searchResultRowComponent={SearchResultRowComponent}
          textInputStyles={inlineStyles.videoDescription}
          maxLength={110}
          autoFocus={false}
        />
      </View>
    );
  }
}

const SearchResultRowComponent = (props) => (
  <View style={inlineStyles.suggestionTextWrapper}>
    <Text style={inlineStyles.suggestionText}>{`#${props.val}`}</Text>
  </View>
);

export default VideoDescription;
