import transporter from "./src/util/mail.js";

async function test() {
  try {
    const info = await transporter.sendMail({
      from: "test@example.com",
      to: "any@example.com",
      subject: "Mailtrap test",
      text: "Hello, this is a test email",
    });
    console.log("Email sent:", info);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

test();
