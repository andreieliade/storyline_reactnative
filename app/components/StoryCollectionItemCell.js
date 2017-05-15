import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, Dimensions, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Conversation from '../model/Conversation'

class StoryCollectionItemCell extends Component {

	constructor(props) {
		super(props)
		this.onPress = this.onPress.bind(this)
	}

	render() {
		story = this.props.story
    return (
			<TouchableOpacity style = {{flex:this.props.flex}} onPress={this.onPress}>
	      <View style={[styles.cellContainer]}>
	        <Image
	          source={{uri: story.imgURL}}
	          style={styles.thumbnail}
	        />
					<LinearGradient
						colors={['transparent', '#000']}
						style={styles.linearGradient}
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
			</TouchableOpacity>
    )
  }

	onPress(){
		this.props.onSelectStory(this.props.story)
	}
}


const styles = StyleSheet.create({
  cellContainer: {
		flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
		paddingTop: 1,
  },
	thumbnail: {
		position: 'absolute',
		left: 0,
		top: 1,
		bottom: 0,
		right: 0,
		resizeMode: 'cover',
	},
	linearGradient: {
		position: 'absolute',
		left: 0,
		top: 1,
		bottom: 0,
		right: 0,
	},
	cellContentContainer:{
		flex: 1,
		width: null,
		height: null,
		backgroundColor: 'rgba(0, 0, 0, 0)',
		justifyContent:'flex-end',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	title: {
		fontSize: 20,
		textAlign: 'left',
		marginLeft: 7,
		color: 'white',
	},
  author: {
		fontSize: 13,
		textAlign: 'left',
		marginLeft: 7,
		marginBottom: 7,
		color: 'white',
  },
})

export default StoryCollectionItemCell;
