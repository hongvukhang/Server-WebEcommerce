const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAOdNTHieVa1Q146RS115oGfgp_FUBfvdg",
  authDomain: "storage-images-89cf3.firebaseapp.com",
  projectId: "storage-images-89cf3",
  storageBucket: "storage-images-89cf3.appspot.com",
  messagingSenderId: "76985251385",
  appId: "1:76985251385:web:d8d674895ccefd05d0bfe8",
  measurementId: "G-Q0RJHDG8LQ",
};

const firebaseApp = initializeApp(firebaseConfig);

module.exports = getStorage(firebaseApp);
