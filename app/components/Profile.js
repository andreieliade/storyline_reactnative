import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, ListView } from 'react-native'
import realm from './realm'
import StoryCollectionItemCell from './StoryCollectionItemCell'


class Profile extends Component {

	constructor(props) {
		super(props)
		this.storyOnStorage = realm.objects('ConversationMarker')    
		dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		this.state = {
			dataSource: dataSource.cloneWithRows(this.storyOnStorage),
			loaded: false,
		}
		this.renderHorizontalList = this.renderHorizontalList.bind(this)
		this.renderStory = this.renderStory.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: dataSource.cloneWithRows(this.storyOnStorage)
		})
	}

	render() {
		return (
			<View style = {styles.container}>
				<Text style = {styles.title}>
					Reading List
				</Text>
			  {this.renderHorizontalList()}
			</View>
		)
	}

	renderHorizontalList() {
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderStory}
				style={styles.listView}
				enableEmptySections={true}
				horizontal = {true}
			/>
		)
	}

	renderStory(story){
		const cellProps = {
			...this.props,
			story: story,
			flex: 1,
			key: story.id,
		}
		return (
			<View style = {styles.cell}>
				<StoryCollectionItemCell {...cellProps}/>
			</View>
    )
	}

}

const styles = StyleSheet.create({
  container: {
  	flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
		backgroundColor: 'white'
  },
	title:{
		fontSize: 19,
		marginTop: 70,
		marginLeft: 16,
		marginBottom: 8,
		color: 'grey',
	},
	listView:{
		height: 50,
	},
	cell:{
		marginRight: 1,
		height: 180,
		width: 120,
	}
})

export default Profile
