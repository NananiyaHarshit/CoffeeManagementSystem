const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Brew Haven" <noreply@brewhaven.com>',
    to,
    subject,
    html,
  };

  if (!transporter) {
    console.log(`\n================ EMAIL NOTIFICATION (DEV SIMULATION) ================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Snippet: ${html.substring(0, 150)}...`);
    console.log(`======================================================================\n`);
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully dispatched to ${to}`);
    return true;
  } catch (error) {
    console.warn(`Email sending failed to ${to}: ${error.message}`);
    return false;
  }
};

const sendWelcomeEmail = async (userName, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFF8F0; padding: 24px; color: #4B2E2B; border-radius: 8px;">
      <h1 style="color: #8C5A3C; margin-bottom: 8px;">Welcome to Brew Haven, ${userName}! ☕</h1>
      <p style="font-size: 16px; line-height: 1.5;">We are thrilled to have you in our coffee lovers family.</p>
      <p style="font-size: 14px; color: #4B2E2B;">Explore our artisanal roasts, freshly baked pastries, and signature espresso blends crafted just for you.</p>
      <div style="margin-top: 24px; padding: 16px; background-color: #C08552; color: #FFF8F0; border-radius: 6px; text-align: center;">
        <strong>Ready for your first cup? Browse our freshly roasted catalog today!</strong>
      </div>
    </div>
  `;
  return sendEmail({ to: userEmail, subject: 'Welcome to Brew Haven!', html });
};

const sendLoginNotification = async (userName, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFF8F0; padding: 24px; color: #4B2E2B; border-radius: 8px;">
      <h2 style="color: #4B2E2B;">New Login to Your Brew Haven Account</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your Brew Haven account was successfully logged in.</p>
      <p style="font-size: 13px; color: #8C5A3C;"><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
      <hr style="border: none; border-top: 1px solid #C08552; margin: 16px 0;" />
      <p style="font-size: 12px; color: #666;">If this wasn't you, please secure your password immediately.</p>
    </div>
  `;
  return sendEmail({ to: userEmail, subject: 'New Login to Your Brew Haven Account', html });
};

const sendOrderConfirmationEmail = async (userEmail, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px;">${item.name} (${item.size})</td>
        <td style="padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFF8F0; padding: 24px; color: #4B2E2B;">
      <h2 style="color: #8C5A3C;">Brew Haven - Order Confirmation 🎉</h2>
      <p>Thank you for your order! Your coffee experience is being prepared with care.</p>
      <p><strong>Order ID:</strong> #${order._id}</p>
      <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background-color: #C08552; color: #FFF8F0;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 16px;">
        <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> ₹${order.tax.toFixed(2)}</p>
        <p><strong>Delivery Fee:</strong> ₹${order.shippingFee.toFixed(2)}</p>
        <h3 style="color: #4B2E2B;">Total Paid: ₹${order.total.toFixed(2)}</h3>
      </div>
    </div>
  `;
  return sendEmail({ to: userEmail, subject: `Order Confirmation #${order._id}`, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendLoginNotification,
  sendOrderConfirmationEmail,
};
