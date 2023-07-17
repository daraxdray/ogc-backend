const axios = require("axios");
exports.sendPushNotification = (
  itemType,
  notificationTitle,
  notificationBody
) => {
  axios
    .post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: "/topics/new",
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        data: {
          type: itemType,
        },
      },
      {
        headers: {
          Authorization:
            "key=AAAA44gmwnE:APA91bF6dA0VggZl0mApBCjwWKV9fhB7B8IPJlnuLHuxPAIPJA5x51N5cztt9lSr9CkP4AGbPY84WDJUN9BrBD0It8zSJMpTZPPkihBjFdMVzsG98QCMxLnYWDnZcVm__2FsyP9bHjts",
        },
      }
    )
    .then((response) => console.log(response))
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};
