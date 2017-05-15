import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, TouchableOpacity, Dimensions} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'
import MessageContainer from './MessageContainer'
import BatteryLow from './BatteryLow'
import NextButton from './NextButton'
import realm from './realm'
var config = require('../config')
var fileData = require('../bundle_data/shadow-part1_11162016.json')
import Utils from '../utils/Utils'
let API_URL = config.apiHost
var navigator

class ChatThread extends Component {

	constructor(props) {
    super(props)

	this.storyOnStorage = realm.objects('ConversationMarker').sorted('lastOpened', true) /* Sort stories by date */
	// console.log(this.storyOnStorage)
	this.firstStory = this.storyOnStorage[0]
	if(this.storyOnStorage.length == 0)
	{
		this.firstStory = Utils.createConversationFromStory(fileData)
	}

	this.state = {
		firstMessageText: "",     				/* while loading json */
		loaded: false,                   	/* to disable the start button while load json */
		batteryLowViewVisible: false,    	/* hide battery Low view */
		endStory: false,               		/* hide end story view */
		story:this.firstStory      /* Set the latest story */
	}

	this.messages = []
	this.getMessages = this.getMessages.bind(this)
	this.showNextMessage = this.showNextMessage.bind(this)
	this.slideUpCoverView = this.slideUpCoverView.bind(this)
	this.initialCoverView = this.initialCoverView.bind(this)
	this.fetchData = this.fetchData.bind(this)
	this.saveStoryOnStorage = this.saveStoryOnStorage.bind(this)
	this.nextButtonAction = this.nextButtonAction.bind(this)
	this.showConversationEnd = this.showConversationEnd.bind(this)
	this.showBatteryLowView = this.showBatteryLowView.bind(this)
	this.renderBatteryLow = this.renderBatteryLow.bind(this)
	this.closeBatteryLowView = this.closeBatteryLowView.bind(this)
	this.batteryState = realm.objects('BatteryState')[0]
  }

	componentDidMount() {
		if (this.props.story.id === undefined) { // When app launch at the beginning, hide cover view
			this.slideUpCoverView()
		}
		if (this.state.story.id !== undefined) {
			this.saveStoryOnStorage(this.state.story)
			this.fetchData(this.state.story.id)
		}
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.story.id != this.props.story.id) { /* whenever story is changed */
			// console.log('newPropsReceived')
			// console.log(nextProps.story.id)
			this.setState({
				firstMessageText: "Loading...",
				loaded: false,
				batteryLowViewVisible: false,
				endStory: false,
				story: nextProps.story
			})
			this.saveStoryOnStorage(nextProps.story)
			this.initialCoverView()
			this.fetchData(nextProps.story.id)
		}
	}

	saveStoryOnStorage(story){   /* find the story in the local storage and update properties */
		this.storyOnStorage = realm.objects('ConversationMarker').filtered('id ="' + story.id + '"')
		var now = new Date()
		realm.write(() => {
			var con = realm.create('ConversationMarker', {
				id: story.id,
				title: story.title,
				seriesCurrent: story.seriesCurrent,
				seriesTotal: story.seriesTotal,
				imgURL: story.imgURL,
				readCount: story.readCount,
				authorName: story.authorName,
				authorID: story.authorID,
				lastOpened: now,
			}, true)
		})
	}

	fetchData(storyId) {
		let REQUEST_URL = API_URL + storyId + '.json'
		// console.log(REQUEST_URL)
		fetch(REQUEST_URL)
			.then((response) => response.json())
      	.then((conversationData) => {
				this.messages = conversationData.messages
				this.nextStory = Utils.createConversationFromStory(conversationData.next)   /* for end view */
				this.user1 = conversationData.characters[0]
				this.user2 = conversationData.characters[1]
				this.localUser = (this.user1.is_local !== undefined) ? this.user1 : this.user2

				var firstMessageText
				if (conversationData.summary) {
					firstMessageText = conversationData.summary
				} else {
					firstMessageText = this.messages[0].text
				}
				this.readIndex = 1
				if (this.storyOnStorage.length > 0) {     /* if reach to the end story, move to first again */
					this.readIndex = (this.storyOnStorage[0].readIndex===this.messages.length) ? 1 : this.storyOnStorage[0].readIndex
				}
				this.setState({
					conversation: conversationData,
					firstMessageText: firstMessageText,
					loaded: true,
					readIndex: this.readIndex,  /* count of read messages */
					endStory: false,
				})
			})
			.catch((error) => {
				console.log(error);
			})
		.done()

	}

	getMessages() {       /* get all messages : 1 ~ readIndex */
		return this.messages.slice(0, this.state.readIndex)
	}

	slideUpCoverView() {
		screenHeight = Dimensions.get('window').height
		this.refs.coverView.transitionTo({bottom:screenHeight})
	}

	initialCoverView() {   /* Show cover view */
		this.refs.coverView.transitionTo({bottom:0}, 1)
	}

	showBatteryLowView() {   /* Show battery low view and update the state of battery in local storage*/
		if (!this.batteryState.started) {
			realm.write(()=>{
				this.batteryState.started = true
				this.batteryState.lowBatterystartDate = (new Date())
			})
		}
		this.setState({
			batteryLowViewVisible: true,
		})
	}

	closeBatteryLowView(){
		this.setState({
			batteryLowViewVisible: false,
		})
	}

	showConversationEnd(){
		this.setState({
			endStory: true,
		})
	}

	showNextMessage(step) {
		this.readIndex = this.state.readIndex + step
		this.setState({
			readIndex: this.readIndex
		})
		realm.write(()=>{
			this.storyOnStorage[0].readIndex = this.readIndex
			this.storyOnStorage[0].lastOpened = new Date()
		})
	}

	nextButtonAction(){
		if (this.state.endStory) {  /* when reach end of Story */
			this.setState({
				firstMessageText: "Loading...",
				loaded: false,
				batteryLowViewVisible: false,
				endStory: false,
				story: this.nextStory
			})
			this.saveStoryOnStorage(this.nextStory)
			this.initialCoverView()
			this.fetchData(this.nextStory.id)
			return
		}

		if (Utils.waitingOnBattery() && !Utils.isSubscriptionActive()) {
			this.showBatteryLowView()
		} else {
			// console.log(this.messages.length + ' ' + this.state.readIndex)

			if (this.messages.length > this.state.readIndex) {
					let nextMessage = this.messages[this.readIndex]
					if (this.batteryState.started) {
							realm.write(()=>{
								this.batteryState.started = false
								this.batteryState.lowBatterystartDate = null
							})
							this.showNextMessage(2)
					} else if (nextMessage.battery) {
							if (Utils.isSubscriptionActive()) {
								this.showNextMessage(2)
							} else {
								realm.write(()=>{
									this.batteryState.started = false
									this.batteryState.lowBatterystartDate = null
								})
								this.showBatteryLowView()
							}
					} else {
							this.showNextMessage(1)
					}
			} else {
					this.showConversationEnd()
			}
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderBatteryLow()}
			  {this.renderMessageContainer()}
				{this.renderTopWhiteGradientOverlay()}
				{this.renderCover()}
			</View>
		)
	}

	renderMessageContainer () {
		return (
			<View style={styles.coverContentContainer}>
				<MessageContainer style={styles.coverContentContainer}
					messages={this.getMessages()}
					user1={this.user1}
					user2={this.user2}
					localUser={this.localUser}
					ref={component => this._messageContainerRef = component}
				/>
				{this.renderMessageContainerFooter()}
				<NextButton onPress={this.nextButtonAction} />
			</View>
		)
	}

	renderMessageContainerFooter(){
		if (!this.state.endStory) {
			return (
				<View style={styles.emptyMessageContainerFooter}/>
			)
		} else {
			return (
				<View style={styles.endStoryFooter}>
					<Text style={styles.endStoryTitle}>
						"{this.state.story.title}" written by
					</Text>
					<Text style={styles.endStoryTitle}>
						{this.state.story.authorName}
					</Text>
					<View style={{flex:1, marginTop:10}}>
						<Image source={{uri: this.nextStory.imgURL}} style={styles.mainBackground} />
						<LinearGradient
							style={styles.coverContentContainer}
							colors={['rgba(0,0,0,0.3)', '#000']}
						/>
						<View style={styles.nextStoryContent}>
							<Text style={styles.nextStoryReadNext}>
								Read Next:
							</Text>
							<Text style={styles.title}>
								{this.nextStory.title}
							</Text>
							<Text style={styles.author}>
								Written by {this.nextStory.authorName}
							</Text>
						</View>
					</View>
				</View>
			)
		}
	}

	renderTopWhiteGradientOverlay() {
		return  (
			<LinearGradient
				style={styles.topOverlayWhiteGradient}
				colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
			/>
		)
	}

	renderCover(){
		story = this.state.story
		return (
			<Animatable.View style={styles.coverContentContainer} ref="coverView">
				<View style={styles.container}>
					<Image source={{uri: story.imgURL}} style={styles.mainBackground} />
					<LinearGradient
						style={styles.coverContentContainer}
						colors={['transparent', '#000']}
					/>
					<View style={styles.coverContentContainer}>
						<Text style={styles.title}>
							{story.title}
						</Text>
						<Text style={styles.author}>
							{story.authorName}
						</Text>
						<Text style={styles.message}>
							{this.state.firstMessageText}
						</Text>
						<TouchableOpacity disabled={!this.state.loaded} style={styles.startButton} onPress={this.slideUpCoverView}>
							<Text style={styles.startText}>
								Start
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Animatable.View>
		)
	}

	renderBatteryLow(){
		const batteryLowModalProps = {
      ...this.props,
      visible: this.state.batteryLowViewVisible,
      onClose: this.closeBatteryLowView,
    }
    return (
      <BatteryLow {...batteryLowModalProps} />
    )
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'white',
	},
  mainBackground: {
  	flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
  },
	coverContentContainer:{
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0)',
		justifyContent:'flex-end',
		flexDirection: 'column',
		alignItems: 'stretch',
	},
	title: {
		fontSize: 25,
		textAlign: 'left',
		marginLeft: 26,
		color: 'white'
	},
	author: {
		fontSize: 16,
		textAlign: 'left',
		paddingLeft: 26,
		paddingBottom: 5,
		color: 'white',
	},
	message: {
		fontSize: 13,
		textAlign: 'left',
		paddingLeft: 26,
		paddingRight: 26,
		paddingTop: 10,
		color: 'white',
	},
	startButton: {
		marginLeft: 26,
		marginBottom: 20,
		marginRight: 26,
		marginTop: 40,
		borderWidth: 1,
		borderColor: 'white',
		height: 45,
		justifyContent: 'center'
	},
	nextButton: {
		position:'absolute',
		bottom: 20,
		left: 26,
		bottom: 20,
		right: 26,
		marginTop: 30,
		borderWidth: 1,
		borderColor: '#9B2FAE',
		backgroundColor: 'transparent',
		height: 45,
		justifyContent: 'center'
	},
	startText: {
		textAlign: 'center',
		fontSize: 20,
		color: 'white',
	},
	topOverlayWhiteGradient: {
		top: 0,
		left: 0,
		right: 0,
		height: 100,
	},
	emptyMessageContainerFooter: {
		height: 90
	},
	endStoryFooter: {
		marginTop: 15,
		height: 250,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	endStoryTitle: {
		textAlign: 'right',
		fontSize: 13,
		color: 'black',
		marginRight: 15,
	},
	nextStoryReadNext: {
		fontSize: 16,
		textAlign: 'left',
		paddingLeft: 26,
		paddingBottom: 5,
		marginTop: 10,
		color: 'white',
	},
	nextStoryContent: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0)',
		justifyContent:'flex-start',
		flexDirection: 'column',
		alignItems: 'stretch',
	}

})

export default ChatThread
