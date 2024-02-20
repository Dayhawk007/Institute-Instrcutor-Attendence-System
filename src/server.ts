import { App } from "./app";
import { Database } from "./db/db";

const app=new App();
const database=new Database();


database.connect()
.then(
    ()=>{
        app.start();
    }
)

