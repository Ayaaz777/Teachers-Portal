/**
 * Build a styled pay slip PDF (header with logo + company details) for the main process.
 * @param {{ title: string; columns: string[]; row: string[] }} payload
 * @returns {Buffer}
 */

const fs = require("fs");
const path = require("path");
const { displayNotionSheetColumnLabel } = require("./notion-simplify");

const COMPANY_TAG_LINES = [
  "Reg. 2024/112897/07",
  "Private Company in business",
  "South Africa",
  "Cape Town",
];

/**
 * @returns {string | null} data URL for jsPDF addImage, or null if file missing
 */
function tryLoadLogoDataUrl() {
  const p = path.join(__dirname, "assets", "rme-logo.png");
  try {
    if (!fs.existsSync(p)) {
      return null;
    }
    const b = fs.readFileSync(p);
    return `data:image/png;base64,${b.toString("base64")}`;
  } catch {
    return null;
  }
}

function buildPaySlipPdfBuffer(payload) {
  const { jsPDF } = require("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  /** Left edge for pay slip title through field rows (e.g. through trial rate); header/footer keep `margin`. */
  const bodyContentLeft = 22;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentRight = pageWidth - margin;

  const logoDataUrl = tryLoadLogoDataUrl();
  const logoW = 90;
  const logoH = 130;

  /** Top section: logo flush top-left; company lines aligned & vertically balanced against logo. */
  const logoX = 0;
  const logoY = 0;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoW, logoH);
    } catch {
      /* ignore corrupt image */
    }
  }

  const companyFontSize = 9;
  const companyLeading = 12;
  const nCompanyLines = COMPANY_TAG_LINES.length;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(companyFontSize);
  doc.setTextColor(45, 45, 45);

  /** Baseline of first company line: vertically centered in logo band, or sensible top when no logo. */
  let companyY;
  if (logoDataUrl) {
    const textSpan =
      (nCompanyLines - 1) * companyLeading + companyFontSize * 0.92;
    companyY = (logoH - textSpan) / 2 + companyFontSize * 0.88;
    companyY = Math.max(companyFontSize + 2, companyY);
  } else {
    companyY = margin * 0.35 + companyFontSize;
  }

  for (const line of COMPANY_TAG_LINES) {
    doc.text(line, contentRight, companyY, { align: "right" });
    companyY += companyLeading;
  }

  const lastCompanyBaseline = companyY - companyLeading;
  const companyBlockBottom = lastCompanyBaseline + companyFontSize * 0.35;
  const logoBottom = logoDataUrl ? logoH : 0;
  const headerContentBottom = Math.max(logoBottom, companyBlockBottom);
  const gapBeforeRule = 18;
  let y = headerContentBottom + gapBeforeRule;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.75);
  doc.line(bodyContentLeft, y, contentRight, y);
  const gapAfterRule = 22;
  y += gapAfterRule;

  const slipTitle =
    payload.title && String(payload.title).trim()
      ? String(payload.title).trim()
      : "Pay slip";
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Pay slip", bodyContentLeft, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const slipTitleMaxW = pageWidth - bodyContentLeft - margin;
  const subLines = doc.splitTextToSize(slipTitle, slipTitleMaxW);
  for (const ln of subLines) {
    if (y > pageHeight - margin - 48) {
      doc.addPage();
      y = margin;
    }
    doc.text(ln, bodyContentLeft, y);
    y += 15;
  }
  y += 12;

  doc.setFontSize(10);
  const labelColumnW = 118;
  const valueX = bodyContentLeft + labelColumnW + 14;
  const valueMaxW = contentRight - valueX;

  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const row = Array.isArray(payload.row) ? payload.row : [];

  for (let i = 0; i < columns.length; i++) {
    const label = displayNotionSheetColumnLabel(columns[i]);
    const val = row[i] == null ? "" : String(row[i]);
    if (y > pageHeight - margin - 52) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 25, 25);
    const labelLines = doc.splitTextToSize(label, labelColumnW);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(45, 45, 45);
    const valueLines = doc.splitTextToSize(val || "—", valueMaxW);
    const rowLines = Math.max(labelLines.length, valueLines.length, 1);

    for (let r = 0; r < rowLines; r++) {
      if (y > pageHeight - margin - 52) {
        doc.addPage();
        y = margin;
      }
      if (labelLines[r]) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 25, 25);
        doc.text(labelLines[r], bodyContentLeft, y);
      }
      if (valueLines[r]) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(45, 45, 45);
        doc.text(valueLines[r], valueX, y);
      }
      y += 14;
    }
    y += 8;
  }

  const lastPage = doc.internal.getNumberOfPages();
  doc.setPage(lastPage);

  const footerBottomPad = 40;
  const centerX = pageWidth / 2;
  const footerMeta = COMPANY_TAG_LINES.join(" · ");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  const footerMetaMaxW = pageWidth - margin * 2;
  const footerMetaLines = doc.splitTextToSize(footerMeta, footerMetaMaxW);
  const metaLineLead = 10;
  let yFoot = pageHeight - footerBottomPad;

  for (let i = footerMetaLines.length - 1; i >= 0; i--) {
    doc.text(footerMetaLines[i], centerX, yFoot, { align: "center" });
    yFoot -= metaLineLead;
  }
  yFoot -= 6;
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Recruit My English", centerX, yFoot, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

module.exports = { buildPaySlipPdfBuffer };
