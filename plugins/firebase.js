/**
 * firebase initialize plugin
 */
import Vue from 'vue'
import * as firebase from 'firebase'

console.log(process.env.FIREBASE_CONFIG)
const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG
console.log(FIREBASE_CONFIG)
const firebaseConfig = JSON.parse(FIREBASE_CONFIG)

firebase.initializeApp(firebaseConfig)

Object.defineProperty(Vue.prototype, '$firebase', { value: firebase })
