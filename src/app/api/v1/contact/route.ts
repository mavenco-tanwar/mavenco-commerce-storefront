import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      brandName,
      interestedPlan,
      message,
      source = 'Admin Demo Request Modal',
    } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and Email are required.' },
        { status: 400 }
      );
    }

    const cleanName = String(fullName).trim();
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanPhone = phone ? String(phone).trim() : 'Not provided';
    const cleanBrand = brandName ? String(brandName).trim() : 'Not specified';
    const cleanPlan = interestedPlan ? String(interestedPlan).trim() : 'Standard Evaluation';
    const cleanMessage = message ? String(message).trim() : 'No custom note attached';
    const cleanWhatsApp = cleanPhone.replace(/[^0-9]/g, '');

    const inquiryDoc = {
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      brandName: cleanBrand,
      interestedPlan: cleanPlan,
      message: cleanMessage,
      source,
      status: 'new',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    // 1. Save directly into MongoDB Atlas `contact_inquiries` collection if URI configured
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db('mavenco_platform');
        await db.collection('contact_inquiries').insertOne(inquiryDoc);
        await client.close();
      } catch (dbErr) {
        console.warn('MongoDB inquiry recording notice:', dbErr);
      }
    }

    // 2. Dispatch Notification Email using Environment Variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;
    const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

    if (smtpUser && smtpPass && adminEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const notificationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d14; color: #ffffff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #141724; border-radius: 16px; border: 1px solid #2a2e3f; overflow: hidden; }
            .header { background: linear-gradient(135deg, #e11d48 0%, #f59e0b 100%); padding: 28px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; color: rgba(255,255,255,0.9); font-size: 13px; }
            .content { padding: 32px 28px; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(225,29,72,0.15); border: 1px solid rgba(225,29,72,0.3); color: #fb7185; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 18px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 24px; }
            .info-table td { padding: 12px 14px; border-bottom: 1px solid #1f2333; font-size: 13px; }
            .info-label { color: #94a3b8; font-weight: 600; width: 35%; }
            .info-value { color: #f8fafc; font-weight: bold; }
            .btn-group { text-align: center; margin: 28px 0 10px 0; }
            .btn-whatsapp { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 10px; margin-right: 10px; }
            .btn-email { display: inline-block; padding: 12px 24px; background-color: #e11d48; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 10px; }
            .footer { background-color: #0d0f18; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1f2333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Admin Panel Demo Request</h1>
              <p>A new prospect has requested a demo via Mavenco Commerce Storefront</p>
            </div>
            <div class="content">
              <span class="badge">Lead Source: ${source}</span>
              <table class="info-table">
                <tr>
                  <td class="info-label">👤 Prospect Name</td>
                  <td class="info-value">${cleanName}</td>
                </tr>
                <tr>
                  <td class="info-label">🏢 Brand / Store</td>
                  <td class="info-value" style="color: #fb7185;">${cleanBrand}</td>
                </tr>
                <tr>
                  <td class="info-label">✉️ Email Address</td>
                  <td class="info-value"><a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: none;">${cleanEmail}</a></td>
                </tr>
                <tr>
                  <td class="info-label">📞 Phone / WhatsApp</td>
                  <td class="info-value">${cleanPhone}</td>
                </tr>
                <tr>
                  <td class="info-label">💳 SaaS Tier Interest</td>
                  <td class="info-value" style="color: #f59e0b;">${cleanPlan}</td>
                </tr>
                <tr>
                  <td class="info-label">💬 Message / Notes</td>
                  <td class="info-value" style="font-weight: normal; color: #cbd5e1;">${cleanMessage}</td>
                </tr>
                <tr>
                  <td class="info-label">⏰ Received At</td>
                  <td class="info-value" style="font-size: 12px; font-weight: normal; color: #94a3b8;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
                </tr>
              </table>

              <div class="btn-group">
                ${
                  cleanWhatsApp
                    ? `<a href="https://wa.me/${cleanWhatsApp}?text=Hi%20${encodeURIComponent(cleanName)}%2C%20thank%20you%20for%20requesting%20a%20demo%20of%20Mavenco%20Commerce%20Platform%20for%20${encodeURIComponent(cleanBrand)}." class="btn-whatsapp">Chat On WhatsApp →</a>`
                    : ''
                }
                <a href="mailto:${cleanEmail}?subject=Mavenco%20Commerce%20Demo%20for%20${encodeURIComponent(cleanBrand)}" class="btn-email">Reply via Email →</a>
              </div>
            </div>
            <div class="footer">
              Mavenco Global Commerce Cloud Engine • Automated Lead Notification Daemon
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"Mavenco Lead Engine" <${smtpUser}>`,
        to: adminEmail,
        replyTo: cleanEmail,
        subject: `🔥 [Demo Request] ${cleanBrand} (${cleanName}) - ${cleanPlan}`,
        html: notificationHtml,
      });

      // 3. Auto-acknowledgement to prospect
      try {
        const ackHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d14; color: #ffffff; margin: 0; padding: 20px; }
              .container { max-width: 550px; margin: 0 auto; background-color: #141724; border-radius: 16px; border: 1px solid #2a2e3f; overflow: hidden; }
              .header { background: linear-gradient(135deg, #e11d48 0%, #1e1b4b 100%); padding: 26px; text-align: center; }
              .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; }
              .content { padding: 28px; line-height: 1.6; font-size: 14px; color: #cbd5e1; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 10px; margin-top: 15px; }
              .footer { background-color: #0d0f18; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1f2333; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Choosing Mavenco</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${cleanName}</strong>,</p>
                <p>We have successfully received your demo request for <strong>${cleanBrand}</strong> (${cleanPlan}).</p>
                <p>Our solutions architecture team is preparing your custom evaluation sandbox and will contact you directly within 2 hours.</p>
                <p>Need immediate assistance or have a specific launch timeline? Connect with us directly on WhatsApp:</p>
                <div style="text-align: center;">
                  <a href="https://wa.me/918239019096?text=Hi%20Ammar%2C%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(cleanBrand)}." class="btn">Chat on WhatsApp (+91 82390 19096)</a>
                </div>
              </div>
              <div class="footer">
                Mavenco Commerce Cloud • ${adminEmail}
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Mavenco Commerce Team" <${smtpUser}>`,
          to: cleanEmail,
          subject: `🎉 We received your demo request for ${cleanBrand} - Mavenco Commerce`,
          html: ackHtml,
        });
      } catch (ackErr) {
        console.warn('Prospect auto-acknowledgement notice:', ackErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo inquiry recorded and notification dispatched successfully.',
      inquiryId: inquiryDoc.createdAt,
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch inquiry' },
      { status: 500 }
    );
  }
}
