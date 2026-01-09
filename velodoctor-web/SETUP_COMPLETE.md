# 🎉 VeloDoctor Booking System - Setup Complete

## ✅ What's Been Implemented

### 1. **Complete Booking System**
- ✅ 4-step booking wizard UI ([/booking](app/booking/page.js))
- ✅ Fixed time slots (09:00, 10:30, 12:00, 13:30, 15:00, 16:30, 18:00)
- ✅ Real-time availability checking via API
- ✅ 90-minute appointment duration
- ✅ Overlap prevention (only ONE customer per slot)
- ✅ Europe/Brussels timezone handling
- ✅ Supabase database integration

### 2. **API Routes**
- ✅ `GET /api/availability?date=YYYY-MM-DD` - Check available slots
- ✅ `POST /api/booking` - Create appointments with validation
- ✅ Email notifications integrated via Google Apps Script

### 3. **Email Notifications** 📧
- ✅ Google Apps Script webhook configured
- ✅ Admin notification (full booking details)
- ✅ Customer confirmation email (professional template)
- ✅ Automatic sending after each booking

### 4. **Website Updates**
- ✅ All CTAs changed to "Prendre rendez-vous"
- ✅ Messaging focused on 45€ diagnostic (refunded if quote accepted)
- ✅ WhatsApp button added (https://wa.me/+32456951445)
- ✅ Phone number updated (+32 456 95 14 45)
- ✅ Premium minimal design maintained

---

## 🔧 What You Still Need to Do

### 1. **Use Existing Supabase DB** (Required for bookings to work)

1. Use the same Supabase project as `velodoctor-admin` (single shared DB)
2. **Do not create a new Supabase project for `velodoctor-web`**
3. Run the migration `supabase/migrations/20260109101000_appointments_booking.sql`
   in the Supabase SQL Editor (or via Supabase CLI)
4. Get your credentials from Project Settings → API
5. Create a local `.env.local` (not committed) with:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Google Reviews (Optional)

Enable Google Maps reviews on the homepage by adding:

```env
GOOGLE_PLACES_API_KEY=your-google-places-api-key
GOOGLE_PLACE_ID=your-place-id
```

### 2. **Finish Google Apps Script Setup** (For emails)

Your webhook is already configured in `.env.local`:
```
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzfbv3XH8Awpvk0xRRtwnQiwnmzK9TW11ssBDrD3jIr7piI58DaKl6xc8pB1nFUeuFh/exec
```

Follow the guide in [EMAIL_NOTIFICATIONS.md](EMAIL_NOTIFICATIONS.md):
1. Update `ADMIN_EMAIL` in the Google Apps Script
2. Test the script by running `testEmails()`
3. Verify both emails arrive in your Gmail

### 3. **Install Dependencies**

```bash
cd velodoctor-web
npm install @supabase/supabase-js
```

---

## 📊 How the System Works

### Booking Flow:
1. Customer visits `/booking`
2. Selects service type (Collecte / Dépôt atelier)
3. Picks a date → Next.js server route checks Supabase for available slots
4. Selects time slot → Fills contact details
5. Submits → Next.js server route validates, creates appointment, sends emails
6. Customer sees success screen

### Overlap Prevention:
- Each time slot can only be booked ONCE
- Available slots shown as blue buttons
- Unavailable slots are **hidden** (not shown at all)
- System checks availability twice: display + submit

### Email Notifications:
- **Admin**: Receives full booking details with customer info
- **Customer**: Gets confirmation with appointment summary and 45€ diagnostic info

---

## 📁 File Structure

```
velodoctor-web/
├── app/
│   ├── api/
│   │   ├── availability/route.js    # Check available slots
│   │   └── booking/route.js          # Create appointments + send emails
│   ├── booking/page.js               # 4-step booking wizard
│   ├── contact/page.js               # Updated with new phone/WhatsApp
│   └── page.js                       # Homepage (updated messaging)
├── components/
│   ├── Header.js                     # "Prendre RDV" button
│   ├── Footer.js
│   └── Button.js                     # Slimmer, wider premium buttons
├── ../supabase/migrations/20260109101000_appointments_booking.sql  # Shared DB migration
├── BOOKING_SYSTEM.md                 # Technical documentation
├── EMAIL_NOTIFICATIONS.md            # Email setup guide
└── .env.local.example                # Template for env vars
```

---

## 🧪 Testing Checklist

Once Supabase is set up:

- [ ] Visit `/booking` and complete a test booking
- [ ] Verify appointment appears in Supabase `appointments` table
- [ ] Check you received admin notification email
- [ ] Check test customer email for confirmation
- [ ] Try booking the same slot twice → should show conflict
- [ ] Test "Collecte" requires address field
- [ ] Test "Dépôt atelier" doesn't require address

---

## 🚀 Going Live

Before deploying to production:

1. **Environment Variables**: Set all env vars in your hosting platform (Vercel/Netlify)
2. **Test Emails**: Make sure `ADMIN_EMAIL` in Google Apps Script is your real email
3. **Update Contact Info**: Verify phone/WhatsApp links work
4. **Domain**: Update email templates with your actual domain (if needed)

---

## 📞 Current Contact Information

- **Phone**: +32 456 95 14 45
- **WhatsApp**: https://wa.me/+32456951445
- **Email**: trott@velodoctor.be

---

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore` (secrets safe)
- ✅ Service role key only used in Next.js server routes (never in client code)
- ✅ RLS policies prevent unauthorized database access
- ✅ Email webhook URL is safe to expose (Google Apps Script handles auth)

---

## 📚 Documentation

- **Booking System**: [BOOKING_SYSTEM.md](BOOKING_SYSTEM.md)
- **Email Setup**: [EMAIL_NOTIFICATIONS.md](EMAIL_NOTIFICATIONS.md)
- **Environment Variables**: [.env.local.example](.env.local.example)

---

## ❓ FAQs

**Q: Can slots overlap?**
A: No. Each slot can only be booked once. The system validates availability on both display and submission.

**Q: Are unavailable slots shown greyed out?**
A: Currently NO - they're completely hidden. Only available slots appear. This can be changed if needed.

**Q: Where do I see bookings?**
A: In your Supabase project → Table Editor → `appointments` table

**Q: Can I change the time slots?**
A: Yes, edit the `TIME_SLOTS` array in both `/api/availability/route.js` and `/api/booking/route.js`

**Q: What timezone is used?**
A: Europe/Brussels (UTC+1 in winter, UTC+2 in summer)

---

## 🎯 Next Steps

1. Set up Supabase (see above)
2. Test the booking system end-to-end
3. Verify emails are working
4. Deploy to production!

---

**All code is ready. Just add your Supabase credentials and you're live!** 🚀
