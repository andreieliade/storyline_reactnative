import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, Dimensions, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Conversation from '../model/Conversation'
import Utils from '../utils/Utils'



class StorySearchResultCell extends Component {

	render() {
		story = Utils.createConversationFromStory(this.props.story)
    return (
      <View style={[styles.cellContainer]}>
        <Image
          source={{uri: story.imgURL}}
          style={styles.thumbnail}
        />
				<View style={styles.cellContentContainer}>
					<Text style={styles.title}>
						{story.title}
					</Text>
					<Text style={styles.author}>
						Written by {story.authorName}
					</Text>
				</View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  cellContainer: {
		flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
		paddingTop: 1,
    height: 60,
  },
	thumbnail: {
		marginLeft: 2,
		marginTop: 2,
		marginBottom: 2,
		marginRight: 5,
		resizeMode: 'cover',
    width: 80,
	},
	cellContentContainer:{
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0)',
		justifyContent:'center',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	title: {
		fontSize: 18,
		textAlign: 'left',
    marginTop: 2,
		marginLeft: 0,
		color: 'black',
	},
  author: {
		fontSize: 13,
		textAlign: 'left',
		marginLeft: 0,
		marginBottom: 2,
		color: 'black',
  },
})

export default StorySearchResultCell;
