import Conversation from '../model/Conversation'
import realm from '../components/realm'
import config from '../config'
import InAppBilling from 'react-native-billing'

var isSubscriptionActive = false;
var productDetails = null;

let Utils = {
  createConversationsFromStories: function(stories){
    return (
      stories.map(function(story){
        var seriesCurrent = 0
        var seriesTotal = 0
        if (story.series !== undefined && story.series.count == 2) {
          seriesCurrent = story.series[0].parseInt()
          seriesTotal = story.series[1].parseInt()
        }
        var conversation = new Conversation()
        conversation.id = story.id
        conversation.title = story.title
        conversation.authorName = (story.author.name != undefined) ? story.author.name : 'Anonymous'
        conversation.authorID = story.author.id
        conversation.imgURL = story.image_url
        conversation.readCount = story.read_count
        conversation.seriesTotal = seriesTotal
        conversation.seriesCurrent = seriesCurrent
        conversation.tags = story.tags
        return conversation
      })
    )
  },

  createConversationFromStory: function(story){
      var seriesCurrent = 0
      var seriesTotal = 0
      if (story.series !== undefined && story.series.count == 2) {
        seriesCurrent = story.series[0].parseInt()
        seriesTotal = story.series[1].parseInt()
      }
      var conversation = new Conversation()
      conversation.id = story.id
      conversation.title = story.title
      conversation.authorName = (story.author.name != undefined) ? story.author.name : 'Anonymous'
      conversation.authorID = story.author.id
      conversation.imgURL = story.image_url
      conversation.readCount = story.read_count
      conversation.seriesTotal = seriesTotal
      conversation.seriesCurrent = seriesCurrent
      conversation.tags = story.tags
      return conversation
  },

  groupItems : function(items) { /* Groupage story items to show in every Rows */
      var itemsPerRow = 2
      var itemsGroups = []
      var group = []
      items.forEach(function(item) {
        if (group.length === itemsPerRow) {
          itemsGroups.push(group)
          switch (itemsPerRow) { /* Groups will have items : 2, 3, 4, 6, 4, 6, 4....*/
            case 2:
              itemsPerRow = 3
              break
            case 3:
              itemsPerRow = 5
              break
            case 5:
              itemsPerRow = 4
              break
            case 4:
              itemsPerRow = 6
              break
            case 6:
              itemsPerRow = 4
              break
            default:
          }
          group = [item]
        } else {
          group.push(item)
        }
      })
      if (group.length > 0) { /* add the last group */
          itemsGroups.push(group)
      }
      return itemsGroups
  },

  waitingOnBattery: function(){
    if(realm.objects('BatteryState')[0].started == false){
      return false
    }
    let millisecondsElapsed = (new Date()).getTime() - realm.objects('BatteryState')[0].lowBatterystartDate.getTime()
    var secondsLeft = config.rechargeTime - Math.floor(millisecondsElapsed/1000)

    if (secondsLeft <= 0) {
      return false
    } else {
      return true
    }
  },

  timeLeft: function(){
    if (realm.objects('BatteryState')[0].lowBatterystartDate === null){
      return ''
    }
    let millisecondsElapsed = (new Date()).getTime() - realm.objects('BatteryState')[0].lowBatterystartDate.getTime()
    let secondsLeft = config.rechargeTime - Math.floor(millisecondsElapsed/1000)
    let minutes = Math.floor(secondsLeft / 60)
    let seconds = secondsLeft - minutes * 60
    return (minutes + 'm ' + seconds +'s')
  },
  secondsLeft: function(){
    if (realm.objects('BatteryState')[0].lowBatterystartDate === null){
      return 0
    }
    let millisecondsElapsed = (new Date()).getTime() - realm.objects('BatteryState')[0].lowBatterystartDate.getTime()
    let secondsLeft = config.rechargeTime - Math.floor(millisecondsElapsed/1000)

    return secondsLeft
  },

  getProductDetails: function() {
    return productDetails;
  },

  isSubscriptionActive: function(){
    return isSubscriptionActive
  },

  updateInAppBilling: async function() {
    var productIds = ['storyline_7day', 'storyline_1month', 'storyline_1year'];

    await InAppBilling.close();
    try {
      await InAppBilling.open();
      InAppBilling.listOwnedSubscriptions('com.pz.story')
      .then((ownedIds) => {
        isSubscriptionActive = ownedIds.length && ownedIds.length > 0;  
      }); 
      InAppBilling.getSubscriptionDetailsArray(productIds).then((details) => {
        var map = {};
        details.forEach((productDetail) => {
          map[productDetail.productId] = productDetail;
        });
        console.log("Fetched details: ", map);
        productDetails = map;
      });
    } catch (err) {
      console.log(err);
    } finally {
      await InAppBilling.close();
    }
  },

  updateSubscriptionStatusFromTransactionDetails: function(details) {
    if (details.purchaseState === 'PurchasedSuccessfully') {
      isSubscriptionActive = true
    }
  }
}

module.exports = Utils
