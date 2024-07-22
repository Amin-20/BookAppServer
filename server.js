const mongoose=require('mongoose');
const dotenv=require("dotenv");
const app=require('./app')
dotenv.config({path:"./config.env"});

const Db=process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);


mongoose.connect(Db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((con)=>{
    console.log(con.connections),
    console.log("Db connected")
}).catch(err=>{
    console.log(err.message)
});




const port = process.env.PORT || 27001;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});