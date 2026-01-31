import { Schema, model } from "mongoose";
//schema
const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "email already exists"],
      lowercase: true,
    },
    otp: { type: String, required: true },
    destroyedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

otpSchema.index({ destroyedAt: 1 }, { expireAfterSeconds: 120 });

//model
export const OTP = model("otp", otpSchema);
