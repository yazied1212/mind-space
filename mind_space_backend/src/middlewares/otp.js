import { OTP } from "../db/models/otp.js";
import { generateOtp, messages, sendEmail } from "../utils/index.js";

export const generateAndSendOtp = async (email) => {
  
    const isExist = await OTP.findOne({ email: email });

    if (isExist) {
      throw new Error(messages.user.alreadyExists, { cause: 409 });
    }

    const otp = generateOtp(6);
    await OTP.create({ email: email, otp: otp });

    const isSent = sendEmail({
      to: email,
      subject: "otp",
      html: `<p>please enter this code ${otp}</p>`,
    });
    if (!isSent) {
      throw new Error("fail to send email please try again");
    }
  
};
