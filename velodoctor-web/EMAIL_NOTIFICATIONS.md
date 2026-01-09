# Email Notifications with Google Apps Script

This guide explains how to set up email notifications for new bookings using Google Apps Script.

## Overview

When a customer books an appointment:
1. Booking is saved to Supabase
2. API calls your Google Apps Script webhook
3. Script sends 2 emails:
   - **Admin email** (to you) with booking details
   - **Customer confirmation email** with appointment summary

---

## Step 1: Create Google Apps Script

### 1.1 Create New Script

1. Go to https://script.google.com
2. Click **"New Project"**
3. Name it: "VeloDoctor Booking Notifications"

### 1.2 Add the Script Code

Replace the default code with this:

```javascript
/**
 * VeloDoctor Booking Notification System
 * Sends emails when new appointments are booked
 */

// CONFIGURATION
const ADMIN_EMAIL = "your-email@gmail.com"; // ⚠️ CHANGE THIS TO YOUR EMAIL
const FROM_NAME = "VeloDoctor";

/**
 * Handle POST requests from the booking API
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!data.appointment || !data.customer) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing required fields"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Send admin notification
    sendAdminNotification(data);

    // Send customer confirmation
    sendCustomerConfirmation(data);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Emails sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send notification email to admin
 */
function sendAdminNotification(data) {
  const { appointment, customer } = data;

  const subject = `🔔 Nouvelle réservation - ${customer.name}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #293133; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #00ACC2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f7f7f7; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-row { background: white; padding: 12px; margin: 8px 0; border-radius: 4px; }
        .label { font-weight: bold; color: #293133; }
        .value { color: #555; }
        .important { background: #FF6D00; color: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">⚡ Nouvelle réservation VeloDoctor</h2>
        </div>
        <div class="content">
          <div class="important">
            <strong>Type de service:</strong> ${appointment.serviceType}
          </div>

          <h3>📅 Détails du rendez-vous</h3>
          <div class="info-row">
            <span class="label">Date:</span>
            <span class="value">${formatDate(appointment.scheduledAt)}</span>
          </div>
          <div class="info-row">
            <span class="label">Heure:</span>
            <span class="value">${formatTime(appointment.scheduledAt)}</span>
          </div>
          <div class="info-row">
            <span class="label">Durée:</span>
            <span class="value">90 minutes</span>
          </div>

          <h3>👤 Informations client</h3>
          <div class="info-row">
            <span class="label">Nom:</span>
            <span class="value">${customer.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:${customer.email}">${customer.email}</a></span>
          </div>
          <div class="info-row">
            <span class="label">Téléphone:</span>
            <span class="value"><a href="tel:${customer.phone}">${customer.phone}</a></span>
          </div>

          ${customer.address ? `
          <div class="info-row">
            <span class="label">Adresse:</span>
            <span class="value">${customer.address}</span>
          </div>
          ` : ''}

          ${customer.vehicleType ? `
          <div class="info-row">
            <span class="label">Type de véhicule:</span>
            <span class="value">${customer.vehicleType}</span>
          </div>
          ` : ''}

          ${customer.message ? `
          <h3>💬 Message du client</h3>
          <div class="info-row">
            <p style="margin: 0;">${customer.message}</p>
          </div>
          ` : ''}

          <div style="margin-top: 20px; padding: 15px; background: #e8f5f7; border-radius: 4px;">
            <p style="margin: 0; font-size: 12px; color: #555;">
              ID de réservation: ${appointment.id}<br>
              Reçu le: ${new Date().toLocaleString('fr-BE')}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, "", {
    htmlBody: htmlBody,
    name: FROM_NAME
  });
}

/**
 * Send confirmation email to customer
 */
function sendCustomerConfirmation(data) {
  const { appointment, customer } = data;

  const subject = `✅ Confirmation de rendez-vous - VeloDoctor`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #293133; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #00ACC2; color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
        .appointment-box { background: #f7fafb; border-left: 4px solid #FF6D00; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #293133; display: inline-block; width: 140px; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        .btn { display: inline-block; background: #FF6D00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">⚡ VeloDoctor</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Vous roulez, on répare</p>
        </div>
        <div class="content">
          <h2 style="color: #00ACC2;">Réservation confirmée !</h2>
          <p>Bonjour <strong>${customer.name}</strong>,</p>
          <p>Votre demande de diagnostic a bien été enregistrée. Voici les détails de votre rendez-vous :</p>

          <div class="appointment-box">
            <div class="info-row">
              <span class="label">Service:</span>
              <strong>${appointment.serviceType}</strong>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              ${formatDate(appointment.scheduledAt)}
            </div>
            <div class="info-row">
              <span class="label">Heure:</span>
              ${formatTime(appointment.scheduledAt)}
            </div>
            <div class="info-row">
              <span class="label">Durée:</span>
              90 minutes
            </div>
            ${customer.address ? `
            <div class="info-row">
              <span class="label">Adresse:</span>
              ${customer.address}
            </div>
            ` : ''}
          </div>

          <div style="background: #fff9e6; border: 1px solid #ffd700; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #FF6D00;">💰 Tarif du diagnostic</h3>
            <p style="margin: 0;">
              Le diagnostic coûte <strong>45€</strong>.<br>
              Si vous acceptez notre devis de réparation, le diagnostic est <strong>remboursé intégralement</strong> du montant total.
            </p>
          </div>

          <h3>📞 Besoin de modifier votre rendez-vous ?</h3>
          <p>Contactez-nous :</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="tel:+32456951445" class="btn">📞 Appeler</a>
            <a href="https://wa.me/+32456951445" class="btn" style="background: #25D366;">💬 WhatsApp</a>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Nous avons hâte de vous aider !<br>
            L'équipe VeloDoctor
          </p>
        </div>
        <div class="footer">
          <p>
            VeloDoctor - Réparation mobile de vélos et trottinettes<br>
            📧 trott@velodoctor.be | 📞 +32 456 95 14 45<br>
            Zone d'intervention: Bruxelles-Capitale
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            ID de réservation: ${appointment.id}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(customer.email, subject, "", {
    htmlBody: htmlBody,
    name: FROM_NAME
  });
}

/**
 * Format date to French locale
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time to HH:mm
 */
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('fr-BE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Test function - run this to test email sending
 */
function testEmails() {
  const testData = {
    appointment: {
      id: "test-123",
      serviceType: "Collecte",
      scheduledAt: "2026-01-15T09:00:00+01:00"
    },
    customer: {
      name: "Jean Dupont",
      email: ADMIN_EMAIL, // Send test to yourself
      phone: "+32 456 95 14 45",
      address: "Rue de la Loi 123, 1000 Bruxelles",
      vehicleType: "Vélo électrique",
      message: "Problème avec la batterie"
    }
  };

  sendAdminNotification(testData);
  sendCustomerConfirmation(testData);

  Logger.log("Test emails sent!");
}
```

### 1.3 Configure Script

1. **Change `ADMIN_EMAIL`** on line 9 to your Gmail address
2. Save the script (Ctrl/Cmd + S)

### 1.4 Test the Script

1. Click on **`testEmails`** function in the dropdown
2. Click **Run** (▶️)
3. Grant permissions when prompted
4. Check your Gmail inbox for 2 test emails

### 1.5 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ → Select **"Web app"**
3. Configure:
   - **Description**: "VeloDoctor Booking Notifications"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** - you'll need this next!

It will look like: `https://script.google.com/macros/s/XXXXX/exec`

---

## Step 2: Update Booking API

Now we need to update the booking API to call your Google Apps Script webhook.

### 2.1 Add Environment Variable

Add this to your `.env.local` file:

```env
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
```

Replace `XXXXX` with your actual webhook URL from Step 1.5.

### 2.2 Update API Route

The booking API will be updated to send notifications after creating an appointment.

---

## Step 3: Email Templates

### Admin Email Preview:
```
Subject: 🔔 Nouvelle réservation - Jean Dupont

⚡ Nouvelle réservation VeloDoctor

Type de service: Collecte

📅 Détails du rendez-vous
Date: mercredi 15 janvier 2026
Heure: 09:00
Durée: 90 minutes

👤 Informations client
Nom: Jean Dupont
Email: jean@example.com
Téléphone: +32 456 95 14 45
Adresse: Rue de la Loi 123, 1000 Bruxelles
Type de véhicule: Vélo électrique

💬 Message du client
Problème avec la batterie
```

### Customer Confirmation Email Preview:
```
Subject: ✅ Confirmation de rendez-vous - VeloDoctor

⚡ VeloDoctor
Vous roulez, on répare

Réservation confirmée !

Bonjour Jean Dupont,

Votre demande de diagnostic a bien été enregistrée.

Service: Collecte
Date: mercredi 15 janvier 2026
Heure: 09:00
Durée: 90 minutes
Adresse: Rue de la Loi 123, 1000 Bruxelles

💰 Tarif du diagnostic
Le diagnostic coûte 45€.
Si vous acceptez notre devis de réparation, le diagnostic est remboursé intégralement.

📞 Besoin de modifier votre rendez-vous ?
[Appeler] [WhatsApp]
```

---

## Troubleshooting

### Emails not sending
1. Check that you granted Gmail permissions to the script
2. Verify `ADMIN_EMAIL` is correct
3. Check Apps Script execution logs: Extensions → Apps Script → Executions

### Webhook not receiving data
1. Verify the webhook URL in `.env.local` is correct
2. Check that deployment is set to "Anyone" can access
3. Test the webhook directly using Postman or curl

### Test the webhook with curl:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "appointment": {
      "id": "test-123",
      "serviceType": "Collecte",
      "scheduledAt": "2026-01-15T09:00:00+01:00"
    },
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+32 456 95 14 45",
      "address": "Test Address"
    }
  }'
```

---

## Next Steps

Once you've deployed the Google Apps Script and copied the webhook URL, let me know and I'll update the booking API to call it automatically!
