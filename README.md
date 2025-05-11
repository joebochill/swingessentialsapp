# Swing Essentials® App (React-Native)
[Swing Essentials®](https://www.swingessentials.com) provides golfers with affordable, personalized video-based golf lessons. Golfers can submit short videos of their golf swing, and within 48-hours, they receive a personalized swing analysis video from a PGA-certified golf professional.


This project was bootstrapped using the [React Native CLI](https://github.com/react-native-community/cli) and takes advantage of the following libraries (many thanks to the contributors):

* [@react-navigation/native](https://reactnavigation.org/)
* [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash)
* [react-native-iap](https://github.com/dooboolab/react-native-iap)
* [react-native-image-crop-picker](https://github.com/ivpusic/react-native-image-crop-picker)
* [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker)
* [react-native-keychain](https://github.com/oblador/react-native-keychain)
* [react-native-mail](https://github.com/chirag04/react-native-mail)
* [react-native-modal](https://github.com/react-native-modal/react-native-modal)
* [react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)
* [react-native-paper](https://callstack.github.io/react-native-paper/)
* [react-native-picker-select](https://github.com/lawnstarter/react-native-picker-select)
* [react-native-reanimated-carousel](https://github.com/dohooo/react-native-reanimated-carousel)
* [react-native-svg](https://github.com/react-native-svg/react-native-svg)
* [react-native-touch-id](https://github.com/naoufal/react-native-touch-id)
* [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
* [react-native-video](https://github.com/react-native-video/react-native-video)
* [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)
* [react-native-youtube-iframe](https://github.com/LonelyCpp/react-native-youtube-iframe)

<img width="200" alt="Home Screen" src="assets/home.png">

## Features
### Home
The home screen is the first screen you see when opening the app. It presents a dashboard giving you quick access to your latest lessons, latest tips, and new lesson creation.

### Lessons
The lessons page shows a list of your past/pending swing analysis videos. Clicking on a lesson row will open up the analysis.

Lessons | Analysis
---- | ----
<img width="200" alt="Lessons" src="assets/lessons.png"> |  <img width="200" alt="Swing Analysis" src="assets/lesson.png"/>


### Order Credits
New users automatically receive a free credit to use to evaluate the Swing Essentials® service. Additional credits can be purchased on the Order screen. Purchases are accomplished via in-app payments through Apple/Google.

<img width="200" alt="Purchase" src="assets/order.png"/>


### Submit a Swing
To submit a request for a swing analysis, users must provide a video of their swing in the "Face-On" and "Down-the-Line" view. They may select a video file from the existing videos on their device or choose to record a new video live.

There are several settings available if the user wishes to record a new swing from the app. They may set the desired duration of the recording as well as a delay period to give them time to set up prior to the recording. They may also choose to view a graphical overlay over their video to show them how they should stand for each required view.

Capture | Submit
---- | ----
<img width="200" alt="Record Swing" src="assets/record.png"> | <img width="200" alt="Submit Swing" src="assets/submit.png"/>

### Tips / Blogs
Video tips (delivered monthly) can also be viewed through the app. Likewise, the 19th Hole blog posts can also be viewed. Both are accessible from the main menu.

## Getting Started
To extend, update, or contribute to this project, clone the repository to your local machine and install the necessary dependencies (for final deployment, you will also need to install dev dependencies):

````
git clone https://github.com/joebochill/swingessentialsapp.git
cd swingessentialsapp
pnpm install
````

You must have Android Studio (with necessary SDKs and tools installed) and/or Xcode available on your machine to deploy the application. If you have these properly installed, you should be able to open the respective /ios or /android project folders to run the projects. Alternatively, you could use the command line:

````
pnpm run pods && pnpm run ios
pnpm run android
````