# Swing Essentials App (React-Native)
[Swing Essentials](https://www.swingessentials.com) provides golfers with affordable, personalized video-based golf lessons. Golfers can submit short videos of their golf swing, and within 48-hours, they receive a personalized swing analysis video from a PGA-certified golf professional.



This project was bootstrapped using [Create React Native App](https://github.com/react-community/create-react-native-app) and takes advantage of the following libraries:
* [react-native-video](https://github.com/react-native-community/react-native-video)
* [react-native-camera](https://github.com/react-native-community/react-native-camera)
* [react-native-youtube](https://github.com/inProgress-team/react-native-youtube)
* [react-native-image-picker](https://github.com/react-community/react-native-image-picker)
* [react-native-braintree-xplat](https://github.com/kraffslol/react-native-braintree-xplat)

![Splash Screen](assets/splash.jpg | width=300)

## Features
### Lessons
The lessons page is the first page you see when you open the app. It shows a list of your past/pending swing analysis videos as well as information about any lesson credits you currently have available. Clicking on a lesson row will open up the analysis.

![Splash Screen](assets/lessons.PNG | width=300)
![Splash Screen](assets/lessons_unlimited.PNG | width=300)
![Splash Screen](assets/lesson_response.PNG | width=300)

### Order Credits
New users automatically receive a free credit to use to evaluate the Swing Essentials service. Additional credits can be purchased on the Order screen. Multiple packages are available, including an unlimited package that offers unlimited swing analyses for a period of 30 days. Purchases are accomplished via PayPal checkout.

![Splash Screen](assets/purchase.PNG | width=300)

### Submit a Swing
To submit a request for a swing analysis, users must provide a video of their swing in the "Face-On" and "Down-the-Line" view. They may select a video file from the existing videos on their device or choose to record a new video live.

There are several settings available if the user wishes to record a new swing from the app. They may set the desired duration of the recording as well as a delay period to give them time to set up prior to the recording. They may also choose to view a graphical overlay over their video to show them how they should stand for each required view.

![Splash Screen](assets/capture.PNG | width=300)
![Splash Screen](assets/lesson_request.PNG | width=300)

## Set Up
To use or contribute to this project, clone the repository to your local machine and install the necessary dependencies:

````
git clone https://github.com/joebochill/swingessentialsapp2.git
npm install
````

This project has been ejected from create-react-app and as such requires that you have Android Studio or Xcode installed on your machine in order to run builds.