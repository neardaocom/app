import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

class Firebase {

    constructor(config: any) {
        initializeApp(config)
      }

    getFirestore(){
        return getFirestore()
    }
}

export default Firebase


