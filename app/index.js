import React, { Component } from 'react'
import {AppRegistry, StyleSheet, Text, View, ScrollView, StatusBar,BackAndroid, Navigator} from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import TabBar from './components/TabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ChatThread from './components/ChatThread'
import StoryCollection from './components/StoryCollection'
import Profile from './components/Profile'
import realm from './components/realm'
import Utils from './utils/Utils'

export default class Storyline extends Component {

  constructor(props) {
    super(props)
    this.selectStory = this.selectStory.bind(this)
    this.changeView = this.changeView.bind(this)
    this.goBack = this.goBack.bind(this)
    realm.write(() => {
      realm.create('BatteryState', {
        id: 'battery',
      }, true)
    })
  }

  componentDidMount() {
      Utils.updateInAppBilling();
      FCM.requestPermissions(); // for iOS
      FCM.getFCMToken().then(token => {
          // console.log(token)
          // store fcm token in your server
      });
      this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
          if(notif.local_notification){
            //this is a local notification
          }
          if(notif.opened_from_tray){
            //app is open/resumed because user clicked banner
          }
          //await someAsyncCall();

      });
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
          // console.log(token)
          // fcm token may not be available on first load, catch it here
      });
      BackAndroid.addEventListener('hardwareBackPress', this.goBack)
  }
  goBack()
  {
    var self = this
    
    if(this.state.prevPage == undefined) {
        self.tabView.goToPage(0)
    }
    else if(this.state.currentPage == 2)
    {
        self.tabView.goToPage(0)
    }
    else if(this.state.currentPage == 1 && this.state.currentStory.id === undefined)
    {
        self.tabView.goToPage(0)
    }
    else
    {
      self.tabView.goToPage(this.state.prevPage)
    }

    return true
  }
  componentWillMount() {
    StatusBar.setHidden(true)
    this.setState({
      currentPage:1,
      currentStory: {}
    })
  }
  componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    }

  shouldComponentUpdate(nextProps, nextState){
    return nextState.currentStory != undefined
  }

  render() {
    return (
      <ScrollableTabView
      contentProps={{bounces: false}}
        initialPage={1}
        renderTabBar={() => <TabBar/>}
        tabBarPosition='overlayTop'
        ref={(tabView) => { this.tabView = tabView; }}
        page={this.state.currentPage}
        onChangeTab = {(obj)=> {this.changeView(obj.i)}}>
          <StoryCollection
            tabLabel="collection"
            style={styles.tabView}
            onSelectStory={this.selectStory} >
          </StoryCollection>

          <ChatThread
            tabLabel="thread"
            style={styles.tabView}
            story={this.state.currentStory} >
          </ChatThread>

          <Profile
            tabLabel="profile"
            style={styles.tabView}
            onSelectStory={this.selectStory} >
          </Profile>
      </ScrollableTabView>
    )
  }

  selectStory(story){
    this.setState({
      currentPage: 1,
      currentStory: story,
    })
  }
  changeView(number)
  {
    this.setState({
      prevPage:this.state.currentPage,
    })
    this.setState({
      currentPage :number,
    })
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
})

AppRegistry.registerComponent('Storyline', () => Storyline);
