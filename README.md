# The Kayaklog
[![platform](https://img.shields.io/badge/platform-Android-brightgreen.svg)](https://www.android.com)
[![platform](https://img.shields.io/badge/platform-ios-brightgreen.svg)](https://developer.apple.com/develop/)

:iphone: React native app that for logging trajectory data in a kayak

<img src="Images/image1.png" height='auto' width='270'/> <img src="Images/Image2.png" height='auto' width='270'/>

# How to setup?

1. Start the water api using `node index.js` in the `/waterCheckAPI` folder
2. Start an android or Iphone emulator 
3. Use the following command `expo start` in the `\app` folder.

## Features

* Displays A list with asset name, price, latest 24 hours percent change and asset logo for the top 50 cryptos
* Comes with a content provider so Crypto data can be used in other apps through the provided ContentProvider
* Uses fragments to provide single views for phones and a two pane view for tablets that contains crypto information as name, logo,
  description and price.

## Interesting libraries used

* <a href="https://github.com/react-native-maps/react-native-maps">React Native Maps</a>: Library used for map in application.
* <a href="https://github.com/mroderick/PubSubJS">PubSubJS</a>: Library used to publish and subscribe trajectory data
