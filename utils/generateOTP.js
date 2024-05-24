//generate OTP

const generateOTP = async (req, res, next) => {
    const otp = Math.floor(1000 + Math.random() * 6000);//  

    return otp;
}

module.exports = generateOTP;