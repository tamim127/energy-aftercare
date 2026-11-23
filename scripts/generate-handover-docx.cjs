const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
} = require('docx');

async function createDocx() {
  const primaryColor = '00E575'; // Energy Aftercare Green
  const darkColor = '0A0A0A';
  const greyColor = '555555';
  const tableHeaderBg = '121212';
  const zebraBg = 'F7F9F8';

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'D0D5DD' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D0D5DD' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'D0D5DD' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'D0D5DD' },
  };

  const createCell = (text, isHeader = false, isZebra = false, widthPct = 25) => {
    return new TableCell({
      width: { size: widthPct, type: WidthType.PERCENTAGE },
      borders: cellBorder,
      shading: {
        type: ShadingType.CLEAR,
        fill: isHeader ? tableHeaderBg : isZebra ? zebraBg : 'FFFFFF',
      },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: isHeader,
              color: isHeader ? 'FFFFFF' : darkColor,
              size: isHeader ? 20 : 18, // 10pt / 9pt
              font: 'Calibri',
            }),
          ],
        }),
      ],
    });
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            color: darkColor,
            size: 22, // 11pt
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Header / Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'ENERGY AFTERCARE',
                bold: true,
                size: 36,
                color: '107C41',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'Wix Client Handover & Management Guide',
                bold: true,
                size: 44,
                color: darkColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'End-to-End Operational Manual for Josh & The Energy Aftercare Team\n',
                italics: true,
                size: 24,
                color: greyColor,
              }),
              new TextRun({
                text: 'Live URL: https://energy-aftercare-cmsscaleup-100a.wix-site-host.com | Production Release v1.0',
                bold: true,
                size: 20,
                color: '107C41',
              }),
            ],
          }),

          // Divider Paragraph
          new Paragraph({
            spacing: { after: 300 },
            border: {
              bottom: { color: '107C41', space: 1, style: BorderStyle.SINGLE, size: 12 },
            },
          }),

          // Section 1: Executive Summary & Architecture Overview
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 160 },
            children: [
              new TextRun({ text: '1. Executive Summary & Architecture Overview', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'Energy Aftercare is built using a modern Wix Headless Architecture. This architectural model combines an ultra-fast, customized frontend with the robust, secure business engine of Wix Studio. It gives your team complete control over your content, pricing, appointments, customer inquiries, and directory listings directly from the Wix Dashboard without writing code or hiring technical contractors.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: 'Core Management Pillars in Wix:\n', bold: true }),
              new TextRun({ text: '• Wix CMS Collections: ' , bold: true}),
              new TextRun({ text: 'Real-time database storing Support Plans, Approved Installers, FAQs, Page Content, and Site Settings.\n' }),
              new TextRun({ text: '• Wix Bookings v2: ' , bold: true}),
              new TextRun({ text: 'Manages appointment availability, calendar time slots, staff working hours, and virtual vs. on-site scheduling.\n' }),
              new TextRun({ text: '• Wix Communications & CRM: ' , bold: true}),
              new TextRun({ text: 'Captures all customer submissions from the Contact Form, Manufacturer Support Portal, and Free Solar Quote Checker directly into your unified Inbox.\n' }),
              new TextRun({ text: '• Wix Payments: ' , bold: true}),
              new TextRun({ text: 'Processes online customer payments in GBP (£) with automated 0% VAT relief compliance for UK renewables.\n' }),
            ],
          }),

          // Section 2: Master Navigation Map
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '2. Master Navigation Map in Wix Dashboard', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'When you log in at manage.wix.com and select Energy Aftercare, all day-to-day administrative tools are neatly organized on the left-hand navigation sidebar:\n\n',
              }),
              new TextRun({ text: '1. CMS (Content Management System):\n', bold: true }),
              new TextRun({ text: '   └── Collections ➔ SupportPlans (Edit pricing, inclusions, virtual rules)\n' }),
              new TextRun({ text: '   └── Collections ➔ ApprovedInstallers (Publish or pause installers, edit postcodes)\n' }),
              new TextRun({ text: '   └── Collections ➔ FAQs (Add/edit categorized FAQ accordion questions)\n' }),
              new TextRun({ text: '   └── Collections ➔ PageContent & SiteSettings (Update headlines, telephone, email)\n\n' }),
              new TextRun({ text: '2. Booking Services & Calendar:\n', bold: true }),
              new TextRun({ text: '   └── Booking Calendar (View daily/weekly appointments, block holidays, reschedule)\n' }),
              new TextRun({ text: '   └── Booking Services (Configure service durations and pricing)\n\n' }),
              new TextRun({ text: '3. Communications & CRM:\n', bold: true }),
              new TextRun({ text: '   └── Inbox (View incoming homeowner leads, quote audits, and manufacturer inquiries)\n' }),
              new TextRun({ text: '   └── Contacts (Central customer relationship management database)\n' }),
            ],
          }),

          // Section 3: Support Plans & Pricing
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '3. Support Plans & Pricing Management', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'The 4 Energy Aftercare support packages are stored in the Wix CMS collection named SupportPlans. Any changes made here are immediately published across the Home, Services, and Book Online pages.',
              }),
            ],
          }),
          // Plans Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Plan Name', true, false, 25),
                  createCell('Price', true, false, 15),
                  createCell('Visit Type / Delivery', true, false, 25),
                  createCell('Core Offer & Limits', true, false, 35),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Bronze Support Plan', false, false, 25),
                  createCell('£79', false, false, 15),
                  createCell('Virtual Visit Only (Remote apps, telemetry & monitoring)', false, false, 25),
                  createCell('1 technical case, 1 virtual consultation session. Joining details via email.', false, false, 35),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Silver Support Plan', false, true, 25),
                  createCell('£149', false, true, 15),
                  createCell('Virtual Visits (Remote diagnostic sessions)', false, true, 25),
                  createCell('2 cases, 2 virtual visits including remote system health check.', false, true, 35),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Gold Support Plan', false, false, 25),
                  createCell('£299', false, false, 15),
                  createCell('In-Person Visit Available (Accredited UK Engineer)', false, false, 25),
                  createCell('4 cases, priority support, performance and battery optimisation reviews.', false, false, 35),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Platinum Support Plan', false, true, 25),
                  createCell('£449', false, true, 15),
                  createCell('On-Site Senior Specialist Dispatch', false, true, 25),
                  createCell('6 cases, priority support, comprehensive annual review, discounted site visits.', false, true, 35),
                ],
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 160, after: 160 },
            children: [
              new TextRun({
                text: 'CRITICAL OPERATIONAL RULE: Bronze & Silver plans must always have the "isVirtualOnly" field set to true. Gold & Platinum plans must have "isVirtualOnly" set to false. This automatically switches customer booking and confirmation wording between virtual email joining details and on-site engineer dispatch.',
                bold: true,
                color: '9C0006',
              }),
            ],
          }),

          // Section 4: Approved Installers Directory
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '4. Managing Approved Installers Directory & Map', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'The Approved Installers network is managed in CMS ➔ Collections ➔ ApprovedInstallers. The interactive UK map automatically geocodes pins using the "lat" and "lng" fields, and the postcode search matches outward UK postcode areas (e.g., BS, BA, GL, SW).\n\n',
              }),
              new TextRun({ text: 'How to Publish a New Installer:\n', bold: true }),
              new TextRun({ text: '1. In Wix Dashboard, navigate to CMS ➔ Collections ➔ ApprovedInstallers.\n' }),
              new TextRun({ text: '2. Click the "+ Add Item" button in the upper right.\n' }),
              new TextRun({ text: '3. Enter Company Name, Telephone, Email, Base Town, and MCS Number.\n' }),
              new TextRun({ text: '4. Under "coveredPostcodes", enter the 1-2 letter postcode prefixes they cover (comma separated).\n' }),
              new TextRun({ text: '5. Under "lat" and "lng", input their decimal GPS coordinates (e.g. 51.4545, -2.5879).\n' }),
              new TextRun({ text: '6. Set the "status" field to "active". The installer will immediately appear on the live site map!\n\n' }),
              new TextRun({ text: 'How to Pause or Hide an Installer:\n', bold: true }),
              new TextRun({ text: 'Simply change their "status" field from "active" to "paused". The frontend automatically filters out paused installers so they are completely hidden from the public directory until re-activated.', italics: true }),
            ],
          }),

          // Section 5: Wix Bookings & Calendar
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '5. Wix Bookings & Schedule Management', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'When a customer books online, the system creates a verified reservation in Wix Bookings and sends them to the encrypted Wix Checkout.\n\n',
              }),
              new TextRun({ text: 'Managing Working Hours and Available Slots:\n', bold: true }),
              new TextRun({ text: '1. Go to Booking Calendar ➔ click Staff / Work Hours.\n' }),
              new TextRun({ text: '2. Set default working hours (e.g. Monday to Friday, 09:00 - 17:00).\n' }),
              new TextRun({ text: '3. The live website automatically displays only slots that fall within staff working hours and are not yet booked.\n\n' }),
              new TextRun({ text: 'Blocking Vacations & Public Holidays:\n', bold: true }),
              new TextRun({ text: 'In the Booking Calendar, click and drag over the desired hours or entire day and select "Block Time". Those hours are immediately blocked on the website, preventing any double-booking.\n\n' }),
              new TextRun({ text: 'Rescheduling or Cancelling an Appointment:\n', bold: true }),
              new TextRun({ text: 'Click the appointment in your Booking Calendar ➔ select "Reschedule" or "Cancel". Wix handles the email notification to the homeowner automatically.', italics: true }),
            ],
          }),

          // Section 6: CRM & Customer Inquiries
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '6. CRM & Customer Inquiries in Wix Inbox', bold: true, color: '107C41' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'All website submissions automatically create a contact record in Wix Contacts and a message thread in Communications ➔ Inbox.\n\n',
              }),
              new TextRun({ text: '1. Manufacturer Support Inquiries:\n', bold: true }),
              new TextRun({ text: 'Labeled with [MANUFACTURER SUPPORT INQUIRY]. Contains company name, hardware products, support requirements (pre-launch, RMA, backlogs, training), and contact details.\n\n' }),
              new TextRun({ text: '2. Free Solar Quote Checker Inquiries:\n', bold: true }),
              new TextRun({ text: 'Contains quote details, equipment brands, proposed pricing, and homeowner contact info for independent second-opinion audits.\n\n' }),
              new TextRun({ text: '3. General Contact Form Submissions:\n', bold: true }),
              new TextRun({ text: 'Standard inquiries from homeowners and installers regarding ongoing solar/battery assistance.\n\n' }),
              new TextRun({ text: 'Instant Mobile Notifications:\n', bold: true }),
              new TextRun({ text: 'Download the official Wix app on iOS or Android and log in with your Energy Aftercare admin account. Turn on push notifications to receive real-time alerts whenever a customer books or submits a form.' }),
            ],
          }),

          // Section 7: Quick Reference Operational Cheat Sheet
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 160 },
            children: [
              new TextRun({ text: '7. Quick Reference Operational Cheat Sheet', bold: true, color: '107C41' }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Operational Task', true, false, 35),
                  createCell('Wix Dashboard Location', true, false, 45),
                  createCell('Sync Time', true, false, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Update Support Plan price or inclusions', false, false, 35),
                  createCell('CMS ➔ Collections ➔ SupportPlans', false, false, 45),
                  createCell('Immediate', false, false, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Publish a newly vetted installer', false, true, 35),
                  createCell('CMS ➔ Collections ➔ ApprovedInstallers (+ Add Item)', false, true, 45),
                  createCell('Immediate', false, true, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Temporarily hide / pause an installer', false, false, 35),
                  createCell('CMS ➔ Collections ➔ ApprovedInstallers (Set status = paused)', false, false, 45),
                  createCell('Immediate', false, false, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('View upcoming customer bookings', false, true, 35),
                  createCell('Booking Calendar ➔ View Schedule', false, true, 45),
                  createCell('Real-time', false, true, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Block holiday / vacation hours', false, false, 35),
                  createCell('Booking Calendar ➔ Click date/time ➔ Block Time', false, false, 45),
                  createCell('Real-time', false, false, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Review manufacturer inquiry or quote lead', false, true, 35),
                  createCell('Communications ➔ Inbox', false, true, 45),
                  createCell('Real-time', false, true, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Add or modify FAQ question & answer', false, false, 35),
                  createCell('CMS ➔ Collections ➔ FAQs', false, false, 45),
                  createCell('Immediate', false, false, 20),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Update company telephone / email', false, true, 35),
                  createCell('CMS ➔ Collections ➔ SiteSettings', false, true, 45),
                  createCell('Immediate', false, true, 20),
                ],
              }),
            ],
          }),

          // Sign-off
          new Paragraph({
            spacing: { before: 300, after: 120 },
            border: {
              top: { color: '107C41', space: 1, style: BorderStyle.SINGLE, size: 8 },
            },
            children: [
              new TextRun({
                text: 'Energy Aftercare Technical Team • Version 1.0 Production Release Handover',
                italics: true,
                size: 18,
                color: greyColor,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve('WIX_CLIENT_HANDOVER_GUIDE.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Word Document created successfully at: ${outPath} (${buffer.length} bytes)`);

  // Also write to brain artifact directory for download
  const brainDir = path.resolve('C:/Users/bdcalling/.gemini/antigravity/brain/9704a4f2-78c7-4709-9aa5-28222b74e9c6');
  if (fs.existsSync(brainDir)) {
    fs.writeFileSync(path.join(brainDir, 'WIX_CLIENT_HANDOVER_GUIDE.docx'), buffer);
    console.log(`✅ Word Document copied to brain artifact directory.`);
  }
}

createDocx().catch(console.error);
