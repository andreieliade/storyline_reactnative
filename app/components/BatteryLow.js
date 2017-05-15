import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, ListView, Modal, TouchableOpacity, TouchableHighlight,BackAndroid } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import realm from './realm'
import Utils from '../utils/Utils'
import Payment from './Payment'
const timer = require('react-native-timer')
var config = require('../config')

class BatteryLow extends Component {

	constructor(props) {
		super(props)
    this.state = {
      visible: props.visible,
			paymentViewVisible: false,    	/* hide battery Low view */
			notificationVisible : false
    }
    this.close = this.close.bind(this)
		this.showPaymentView = this.showPaymentView.bind(this)
		this.recharge = this.recharge.bind(this)
		this.payment = this.payment.bind(this)
		this.batteryState = realm.objects('BatteryState')[0]
	}

	componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible})
	}

	componentWillUnmount() {
    timer.clearInterval(this);
  }

	componentDidMount(){

		timer.setInterval(this, 'Timer', ()=>{
			if (Utils.secondsLeft() <= 0) {
				if(this.state.notificationVisible == false)
				{
					FCM.presentLocalNotification({
		            title: "STORYLINE",                     // as FCM payload
		            body: "Your Storyline battery's fully charged! Come back to continue your story",                    // as FCM payload (required)
		            sound: "default",                                   // as FCM payload
		            priority: "high",                                   // as FCM payload
		            click_action: "ACTION",                             // as FCM payload
		            badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
		            number: 10,                                         // Android only
		            ticker: "My Notification Ticker",                   // Android only
		            auto_cancel: true,                                  // Android only (default true)
		            large_icon: "ic_launcher",                           // Android only
		            icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
		            big_text: "Your Storyline battery's fully charged! Come back to continue your story",     // Android only
		            sub_text: "",                      // Android only
		            color: "red",                                       // Android only
		            vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
		            tag: 'some_tag',                                    // Android only
		            group: "group",                                     // Android only
		            my_custom_data:'my_custom_field_value',             // extra data you want to throw
		            lights: false,                                       // Android only, LED blinking (default false)
		            show_in_foreground: true                             // notification when app is in foreground (local & remote)
		        });
						this.setState({
							notificationVisible: true
						})
						this.close()
						return
				}
			}
			else {
				this.setState({
					notificationVisible: false
				})
			}
			this.setState({
				timeLeft: Utils.timeLeft()
			})
		}, 1000)
	}

  close(){
		this.setState({
			paymentViewVisible: false,
			notificationVisible: true,
		})

    this.props.onClose()
  }

	render() {
		if(this.state.paymentViewVisible)
		{
		return (
      <Modal
	       animationType = {"fade"}
	       transparent = {true}
	       visible = {this.state.visible}
				 onRequestClose={() => {this.close()}}>
	       <View style = {styles.container}>
	         <View style = {styles.topContainer}>
             	<TouchableOpacity style = {styles.close} onPress = {this.close}>
  							<Image source = {require('../images/close.png')} style={{tintColor:'white'}}/>
             	</TouchableOpacity>
	         </View>
					 {this.renderPayment()}
					 </View>
       </Modal>
		)
	}
	else {
		return (
      <Modal
	       animationType = {"fade"}
	       transparent = {true}
	       visible = {this.state.visible}
				 onRequestClose = {() => {this.close()}}>
	       <View style = {styles.container}>
	         <View style = {styles.topContainer}>
             	<TouchableOpacity style = {styles.close} onPress={this.close}>
  							<Image source={require('../images/close.png')} style={{tintColor:'white'}}/>
             	</TouchableOpacity>
	         </View>
           <View style = {styles.contentContainer}>
              <Image source = {require('../images/lowBattery.png')} style={{marginBottom:20}}/>
              <Text style = {styles.text1}>
                Storyline battery is {"\n"}
                running low!
              </Text>
              <Text style = {styles.text2}>
                You will need to recharge to {"\n"}
                keep reading
              </Text>
							<Text style = {styles.text2}>
								Recharges in:
							</Text>
							<Text style = {styles.text1}>
								{this.state.timeLeft}
							</Text>
           </View>
           <TouchableHighlight style={styles.rechargeButton} onPress={this.recharge}>
					 <View style={styles.buttonView}>
            <Text style={styles.buttonText}>
							Recharge Now
            </Text>
						<Image source={require('../images/batteryIcon.png')} style={{marginLeft:10}}/>
						</View>
           </TouchableHighlight>
	       </View>
       </Modal>
		)
	}
	}

	renderRow(rowData){
		if (this.searching) { /* Row data is story json */
			const cellProps = {
				...this.props,
				story: rowData,
				key: rowData.id,
			}
			return (
				<TouchableOpacity onPress={()=>this.onSelectItem(Utils.createConversationFromStory(rowData))}>
					<StorySearchResultCell {...cellProps}/>
				</TouchableOpacity>
			)
		} else { /* rowData is Tag string */
			return (
				<TouchableOpacity onPress={()=>this.onSelectItem(rowData)}>
					<Text style={styles.tags}> {rowData.toUpperCase()} </Text>
				</TouchableOpacity>
			)
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			 <View
			 	key={`${sectionID}-${rowID}`}
				style={styles.separator}
			/>
		)
	}

	recharge(){
		this.showPaymentView()
	}

	showPaymentView() {   /* Show battery low view and update the state of battery in local storage*/
		this.setState({
			paymentViewVisible: true,
		})
	}

	renderPayment(){
		const paymentModalProps = {
      ...this.props,
      visible: this.state.paymentViewVisible,
      onClose: this.closePaymentView,
			onPayment : this.payment,
    }
    return (
      <Payment {...paymentModalProps}

			/>
    )
	}
	payment()
	{
		realm.write(()=>{
			this.batteryState.lowBatterystartDate = new Date(new Date().getTime() - config.rechargeTime * 1000 )
		})
		this.setState({
			timeLeft: Utils.timeLeft()
		})
		this.close()
	}
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
		backgroundColor: 'rgba(0, 0, 0, 0.88)'
  },
  topContainer:{
    marginTop: 5,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'transparent',
  },
	buttonView:{
		flexDirection:'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
  contentContainer:{
    flex:1,
    backgroundColor:'transparent',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  rechargeButton:{
    height: 45,
		marginBottom: 20,
		marginLeft: 26,
		marginRight: 26,
		marginTop: 40,
		backgroundColor: '#9B2FAE',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
  },
  text1: {
    fontSize: 24,
    color: 'white',
		textAlign: 'center'
  },
  text2: {
    fontSize: 18,
    marginTop: 20,
    color: 'white',
		textAlign: 'center'
  },
	buttonText: {
    fontSize: 20,
    color: 'white',
		textAlign: 'center'
  },
	tags:{
		fontSize: 17,
		paddingTop: 7,
		paddingBottom: 7,
		marginLeft: 10,
		color: 'black',
	},
	close:{
		marginLeft: 5,
	},
})

export default BatteryLow
