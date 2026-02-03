import { model, Schema, Types } from "mongoose"
import { defaultPfpId, defaultPfpUrl, genders, provider, roles } from "../../utils/index.js"
import bcrypt from "bcrypt"

//schema
const userSchema=new Schema({
    userName:{type:String,required:true,unique:[true,"name already exists"]},
    email:{type:String,required:true,unique:[true,"email already exists"]},
    password:{type:String,required: function () {
        return this.provider === provider.system ? true : false;
      },},
    age:{type:Number,required: function () {
        return this.provider === provider.system ? true : false;
      },min:18},
    role:{type:String,required:true,enum:Object.values(roles)},
    gender:{type:"string",enum:genders},
    pfp:{
        secure_url: { type: String, default: defaultPfpUrl },
      public_id: { type: String, default: defaultPfpId },
    },
    twoFA: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    isConfirmed:{type:Boolean,default:false},
    provider: {
      type: String,
      enum: [provider.google, provider.system],
      default: provider.system,
    },

},{
    versionKey:false,timestamps:true
})
//index
userSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 2592000 });

//middleware
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password,10);
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = bcrypt.hashSync(update.password,10);
   // update.lastPassUpdate = Date.now();
  }
});

//model
export const User=model("User",userSchema)