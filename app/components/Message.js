import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, Dimensions, TouchableOpacity,Animated } from 'react-native'

class Message extends Component {
	constructor(props) {
     super(props);
     this.state = {
       fadeAnim: new Animated.Value(0), // init opacity 0
			 dismiss: new Animated.Value(1),
			 appear: new Animated.Value(2),
     };
		 //this.animationComplete = this.animationComplete.bind(this)
   }
	componentDidMount()
	{
		Animated.timing(
       this.state.fadeAnim,
       {
				 delay: 0,
				 toValue: 1,
			 duration: 1000}
     	).start();

		 Animated.timing(
        this.state.dismiss,
        {
					delay: 1000,
					toValue: 0,
 			 		duration: 0}
      ).start();

			Animated.timing(
				 this.state.appear,
				 {
					 delay: 1000,
					 toValue: 1,
					 duration: 1}
			 ).start();
	}
	render() {
		if (this.props.message.sender_id == undefined) {
			return (
				this.renderCenterMessage()
			)
		} else {
			return (
				this.renderChat()
			)
		}
  }

	renderCenterMessage() {
		return (
			<View style = {styles.centerMessageContainer}>
				<Text style={styles.centerMessageText}>
					{this.props.message.text}
				</Text>
			</View>
		)
	}

	renderChat() {
		return (
				<View style = {styles[this.props.position].container}>
					{this.renderBubble()}
					{this.renderUserName()}
				</View>
		)
	}

	renderBubble(){
		var animation1 = this.state.fadeAnim.interpolate({
        inputRange: [0, 0.5, 1],
      	outputRange: ['rgba(210,210,210, 1)', 'rgba(230,230,230, 1)','rgba(210,210,210, 1)']
    });
		var animation2 = this.state.fadeAnim.interpolate({
        inputRange: [0, 0.5, 1],
      outputRange: ['rgba(190,190,190, 1)', 'rgba(210,210,210, 1)','rgba(190,190,190, 1)']
    });
		var animation3 = this.state.fadeAnim.interpolate({
        inputRange: [0, 0.5, 1],
      outputRange: ['rgba(230,230,230, 1)', 'rgba(190,190,190, 1)','rgba(230,230,230, 1)']
    });

		if(this.props.message.delay > 0)
		{
			return(
			<View>
			<Image
			source={bubbleImage[this.props.position].source}
			style={styles[this.props.position].bubbleImage}>
			</Image>
			<View
				style={styles[this.props.position].bubble}>
				<Animated.Text style={[styles[this.props.position].messageText, {opacity: this.state.dismiss.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })}]}>
					{this.props.message.text}
				</Animated.Text>
				<Animated.View style={[styles.animationView, {opacity: this.state.dismiss}]} >
				<Animated.View
						 style={[styles.box, {backgroundColor: animation1}]}
				 />
				 <Animated.View
 						 style={[styles.box, {backgroundColor: animation2}]}
 				 />
				 <Animated.View
 						 style={[styles.box, {backgroundColor: animation3}]}
 				 />
				 </Animated.View>
			</View>
			</View>
		)
		}
		else
		{
		return (
			<View>
			<Image
			source={bubbleImage[this.props.position].source}
			style={styles[this.props.position].bubbleImage}>
			</Image>
			<View
				style={styles[this.props.position].bubble}>
				<Text style={styles[this.props.position].messageText}>
					{this.props.message.text}
				</Text>
			</View>
			</View>
		)
	}
	}

	renderUserName(){
		let currentMessage = this.props.message /* show namelabel when this is last message or next message is the other user's*/
		if (currentMessage.nextMessage === undefined || currentMessage.nextMessage.sender_id !== currentMessage.sender_id) {
			return (
				<View>
				<Text style={styles.userName}>
					{this.props.senderName}
				</Text>
				</View>
			)
		} else {
			return null
		}
	}
}


const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: 20,
      marginRight: 60,
      marginTop: 5,
    },
		bubble:{
			flexDirection: 'column',
	    width: undefined,
	    height: undefined,
	    justifyContent: 'space-between',
			backgroundColor: '#dfdfdf',
			borderRadius: 10,
			marginLeft: 8
		},
		bubbleImage:{
			position: 'absolute',
			bottom: 0,
			left: 0,
		},
    messageText:{
      fontSize: 17,
			marginTop: 8,
			marginLeft: 8,
			marginBottom: 8,
			marginRight: 8,
			backgroundColor:'transparent',
      color: 'black',
    },
  }),

  right: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginLeft: 60,
      marginRight: 20,
      marginTop: 5,
    },
		bubbleImage:{
	    position: 'absolute',
			bottom: 0,
			right: 0,
		},
		bubble:{
			flexDirection: 'column',
	    width: undefined,
	    height: undefined,
	    justifyContent: 'space-between',
	    alignItems: 'center',
			backgroundColor: '#aa2fb7',
			borderRadius: 10,
			marginRight: 8
		},
    messageText:{
      fontSize: 17,
			marginTop: 8,
			marginLeft: 8,
			marginBottom: 8,
			marginRight: 16,
			backgroundColor:'transparent',
      color: 'white',
    },
  }),
  userName: {
		fontSize: 14,
		color: 'rgb(182, 182, 182)',
  },
	centerMessageContainer: {
		marginTop: 15,
		marginBottom: 8,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	centerMessageText: {
		fontSize: 17,
		color: 'rgb(182, 182, 182)',
	},
	box:{
		width:6,
		height:6,
		borderRadius: 3,
		marginLeft : 3,
	},
	animationView:{
		position:'absolute',
		alignItems:'center',
		flexDirection:'row',
		top: 16,
		left: 8,
		justifyContent : 'center'
	}
}

const bubbleImage = {
  right : {
		source : require('../images/MeBubble.png'),
		capInsets : { top: 8, right: 16, bottom: 8, left: 8 },
	},
  left : {
		source : require('../images/PartnerBubble.png'),
		capInsets : { top: 8, left: 16, bottom: 8, right: 8 },
	}
}

export default Message
