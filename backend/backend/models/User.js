const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        max: 50,
        unique: true,
    },
    password:{
        type: String,
        require:true,
        min: 6,
    },
},{ timestamps: true }//自動新增或更新
); 

module.exports = mongoose.model("User", UserSchema);