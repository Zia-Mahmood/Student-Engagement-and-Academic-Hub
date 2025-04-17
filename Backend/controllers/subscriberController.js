const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(409).json({ message: "Already subscribed" });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(500).json({ error: "Subscription failed" });
  }
};

exports.notifySubscribers = async (project) => {
  const subscribers = await Subscriber.find();
  if (!subscribers.length) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    subject: "New Research Project Added",
    html: `
      <h2>${project.title}</h2>
      <p>${project.description}</p>
      <a href="http://localhost:3001/projects/${project._id}">View Project</a>
    `,
  };

  for (const sub of subscribers) {
    transporter.sendMail({ ...mailOptions, to: sub.email });
  }
};
