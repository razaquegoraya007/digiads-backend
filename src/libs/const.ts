export const generateVerificationEmail = (name: string, otp: number) => {
  return `
    Dear User,

    Thanks for signing up for www.suitesolutions.ai, we loop forward to supporting your NetSuite journey!
    Please use the code below to verify your email. 
    
    OTP: ${otp}
    `;
};

export const generateResetPasswordHTMLEmail = (name, resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="color: #333;">
        You have requested to reset your password. Please click the link below to reset your password:
      </p>
      <p>
        <a 
          href="${resetLink}" 
          style="
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Reset Password
        </a>
      </p>
      <p style="color: #333;">
        If you did not request a password reset, please ignore this email or contact support if you have questions.
      </p>
      <p style="color: #333;">
        Thanks,<br/>
        NetSuite Chatbot Support
      </p>
    </div>
  `;
};
