import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/storage';
import 'firebase/firestore';


const app = firebase.initializeApp({
    apiKey: "AIzaSyCpj_kYVf-YjUOa7UXp1FvW6wJ8jSdNvcI",
    authDomain: "casa-de-las-baterias.firebaseapp.com",
    databaseURL: "https://casa-de-las-baterias.firebaseio.com",
    projectId: "casa-de-las-baterias",
    storageBucket: "casa-de-las-baterias.appspot.com",
    messagingSenderId: "789343279448",
    appId: "1:789343279448:web:a5f8094eaab78695"

});

export default app;