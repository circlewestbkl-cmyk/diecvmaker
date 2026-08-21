let puppeteer = null;
let CHROME_PATH = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  console.log('puppeteer-core not available, PDF generation disabled');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

// Escape HTML special characters
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE DEFINITIONS - All ATS-friendly (no tables, no columns)
// ═══════════════════════════════════════════════════════════════

const templates = {
  // ── Classic Template ──
  tpl_classic: {
    name: 'ATS Classic',
    headerStyle: 'centered',
    accentColor: '#4f46e5',
    accentLight: '#eef2ff',
    borderColor: '#4f46e5',
    sectionBorder: '1px solid #e2e8f0',
    headerBg: 'transparent',
    bodyFont: "'Segoe UI', Arial, Helvetica, sans-serif",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #1e293b; font-size: 10pt; line-height: 1.5; }
      .header { text-align: center; padding: 24pt 32pt 16pt; border-bottom: 2px solid ACCENT_COLOR; background: HEADER_BG; }
      .header h1 { font-size: 22pt; color: #0f172a; margin-bottom: 2pt; }
      .subtitle { font-size: 12pt; color: ACCENT_COLOR; font-weight: 500; }
      .contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 8pt; margin-top: 8pt; font-size: 9pt; color: #475569; }
      .section { padding: 12pt 32pt 0; }
      .section h2 { font-size: 12pt; color: ACCENT_COLOR; text-transform: uppercase; letter-spacing: 0.5pt; border-bottom: SECTION_BORDER; padding-bottom: 4pt; margin-bottom: 8pt; font-weight: 700; }
      .item { margin-bottom: 10pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 10.5pt; }
      .company { display: block; font-size: 9.5pt; color: ACCENT_COLOR; }
      .date { font-size: 9pt; color: #64748b; white-space: nowrap; }
      .desc { font-size: 9.5pt; color: #334155; margin-top: 3pt; }
      .tech { font-size: 8.5pt; color: #64748b; margin-top: 2pt; }
      ul { margin: 4pt 0 0 16pt; font-size: 9.5pt; color: #334155; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9.5pt; color: #334155; }
      .skills { display: flex; flex-wrap: wrap; gap: 6pt; }
      .skill { background: ACCENT_LIGHT; color: ACCENT_COLOR_DARK; padding: 2pt 8pt; border-radius: 10pt; font-size: 9pt; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9.5pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  },

  // ── Modern Template ──
  tpl_modern: {
    name: 'ATS Modern',
    headerStyle: 'left',
    accentColor: '#2563eb',
    accentLight: '#eff6ff',
    borderColor: '#2563eb',
    sectionBorder: '1px solid #dbeafe',
    headerBg: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    bodyFont: "'Segoe UI', Arial, Helvetica, sans-serif",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #1e293b; font-size: 10pt; line-height: 1.5; }
      .header { padding: 28pt 32pt 20pt; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; }
      .header h1 { font-size: 24pt; color: white; margin-bottom: 2pt; }
      .subtitle { font-size: 12pt; color: #bfdbfe; font-weight: 400; }
      .contact { display: flex; flex-wrap: wrap; gap: 8pt; margin-top: 8pt; font-size: 9pt; color: #dbeafe; }
      .contact span { background: rgba(255,255,255,0.15); padding: 2pt 8pt; border-radius: 8pt; }
      .section { padding: 12pt 32pt 0; }
      .section h2 { font-size: 12pt; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5pt; border-bottom: 1px solid #dbeafe; padding-bottom: 4pt; margin-bottom: 8pt; font-weight: 700; }
      .item { margin-bottom: 10pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 10.5pt; }
      .company { display: block; font-size: 9.5pt; color: #2563eb; }
      .date { font-size: 9pt; color: #64748b; white-space: nowrap; }
      .desc { font-size: 9.5pt; color: #334155; margin-top: 3pt; }
      .tech { font-size: 8.5pt; color: #64748b; margin-top: 2pt; }
      ul { margin: 4pt 0 0 16pt; font-size: 9.5pt; color: #334155; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9.5pt; color: #334155; }
      .skills { display: flex; flex-wrap: wrap; gap: 6pt; }
      .skill { background: #eff6ff; color: #1e40af; padding: 2pt 8pt; border-radius: 10pt; font-size: 9pt; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9.5pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  },

  // ── Professional Template ──
  tpl_professional: {
    name: 'Professional',
    headerStyle: 'left',
    accentColor: '#334155',
    accentLight: '#f1f5f9',
    borderColor: '#334155',
    sectionBorder: '1px solid #cbd5e1',
    headerBg: '#f8fafc',
    bodyFont: "'Georgia', 'Times New Roman', serif",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', 'Times New Roman', serif; color: #1e293b; font-size: 10pt; line-height: 1.5; }
      .header { padding: 24pt 32pt 16pt; border-bottom: 2pt solid #334155; background: #f8fafc; }
      .header h1 { font-size: 22pt; color: #0f172a; margin-bottom: 2pt; }
      .subtitle { font-size: 12pt; color: #475569; font-weight: 400; font-style: italic; }
      .contact { display: flex; flex-wrap: wrap; gap: 8pt; margin-top: 8pt; font-size: 9pt; color: #475569; }
      .section { padding: 12pt 32pt 0; }
      .section h2 { font-size: 12pt; color: #334155; text-transform: uppercase; letter-spacing: 1pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt; margin-bottom: 8pt; font-weight: 700; }
      .item { margin-bottom: 10pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 10.5pt; }
      .company { display: block; font-size: 9.5pt; color: #475569; font-style: italic; }
      .date { font-size: 9pt; color: #64748b; white-space: nowrap; font-style: italic; }
      .desc { font-size: 9.5pt; color: #334155; margin-top: 3pt; }
      .tech { font-size: 8.5pt; color: #64748b; margin-top: 2pt; }
      ul { margin: 4pt 0 0 16pt; font-size: 9.5pt; color: #334155; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9.5pt; color: #334155; }
      .skills { display: flex; flex-wrap: wrap; gap: 6pt; }
      .skill { background: #f1f5f9; color: #334155; padding: 2pt 8pt; border-radius: 10pt; font-size: 9pt; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9.5pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  },

  // ── Minimalist Template ──
  tpl_minimalist: {
    name: 'Minimalist',
    headerStyle: 'left',
    accentColor: '#1f2937',
    accentLight: '#f9fafb',
    borderColor: '#1f2937',
    sectionBorder: '1px solid #e5e7eb',
    headerBg: 'transparent',
    bodyFont: "'Helvetica Neue', Arial, sans-serif",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; font-size: 10pt; line-height: 1.5; }
      .header { padding: 24pt 32pt 16pt; border-bottom: 1px solid #d1d5db; }
      .header h1 { font-size: 20pt; color: #111827; margin-bottom: 2pt; font-weight: 300; letter-spacing: 0.5pt; }
      .subtitle { font-size: 11pt; color: #6b7280; font-weight: 400; }
      .contact { display: flex; flex-wrap: wrap; gap: 8pt; margin-top: 8pt; font-size: 9pt; color: #6b7280; }
      .section { padding: 12pt 32pt 0; }
      .section h2 { font-size: 10pt; color: #6b7280; text-transform: uppercase; letter-spacing: 2pt; border-bottom: 1px solid #e5e7eb; padding-bottom: 4pt; margin-bottom: 8pt; font-weight: 400; }
      .item { margin-bottom: 10pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 10.5pt; font-weight: 600; }
      .company { display: block; font-size: 9.5pt; color: #6b7280; }
      .date { font-size: 9pt; color: #9ca3af; white-space: nowrap; }
      .desc { font-size: 9.5pt; color: #374151; margin-top: 3pt; }
      .tech { font-size: 8.5pt; color: #9ca3af; margin-top: 2pt; }
      ul { margin: 4pt 0 0 16pt; font-size: 9.5pt; color: #374151; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9.5pt; color: #374151; }
      .skills { display: flex; flex-wrap: wrap; gap: 6pt; }
      .skill { background: #f9fafb; color: #374151; padding: 2pt 8pt; border-radius: 10pt; font-size: 9pt; border: 1px solid #e5e7eb; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9.5pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  },

  // ── Developer Template ──
  tpl_developer: {
    name: 'Developer',
    headerStyle: 'centered',
    accentColor: '#059669',
    accentLight: '#ecfdf5',
    borderColor: '#059669',
    sectionBorder: '1px solid #d1fae5',
    headerBg: 'transparent',
    bodyFont: "'Consolas', 'Fira Code', monospace",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Consolas', 'Fira Code', monospace; color: #1e293b; font-size: 9.5pt; line-height: 1.5; }
      .header { text-align: center; padding: 24pt 32pt 16pt; border-bottom: 2pt solid #059669; }
      .header h1 { font-size: 20pt; color: #065f46; margin-bottom: 2pt; }
      .subtitle { font-size: 11pt; color: #059669; font-weight: 400; }
      .contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 8pt; margin-top: 8pt; font-size: 8.5pt; color: #475569; }
      .contact span { background: #ecfdf5; padding: 2pt 8pt; border-radius: 4pt; }
      .section { padding: 10pt 32pt 0; }
      .section h2 { font-size: 11pt; color: #059669; text-transform: uppercase; letter-spacing: 1pt; border-bottom: 1px solid #d1fae5; padding-bottom: 4pt; margin-bottom: 6pt; font-weight: 700; }
      .item { margin-bottom: 8pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 10pt; }
      .company { display: block; font-size: 9pt; color: #059669; }
      .date { font-size: 8.5pt; color: #64748b; white-space: nowrap; }
      .desc { font-size: 9pt; color: #334155; margin-top: 2pt; }
      .tech { font-size: 8.5pt; color: #059669; margin-top: 2pt; }
      ul { margin: 3pt 0 0 14pt; font-size: 9pt; color: #334155; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9pt; color: #334155; }
      .skills { display: flex; flex-wrap: wrap; gap: 5pt; }
      .skill { background: #ecfdf5; color: #065f46; padding: 2pt 8pt; border-radius: 4pt; font-size: 8.5pt; font-family: 'Consolas', monospace; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  },

  // ── Executive Template ──
  tpl_executive: {
    name: 'Executive',
    headerStyle: 'centered',
    accentColor: '#b45309',
    accentLight: '#fffbeb',
    borderColor: '#b45309',
    sectionBorder: '1px solid #fde68a',
    headerBg: '#fefce8',
    bodyFont: "'Garamond', 'Georgia', serif",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Garamond', 'Georgia', serif; color: #1e293b; font-size: 10.5pt; line-height: 1.5; }
      .header { text-align: center; padding: 28pt 32pt 18pt; border-bottom: 2pt solid #b45309; background: #fffbeb; }
      .header h1 { font-size: 24pt; color: #451a03; margin-bottom: 2pt; font-weight: 700; }
      .subtitle { font-size: 12pt; color: #b45309; font-weight: 400; }
      .contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 10pt; margin-top: 8pt; font-size: 9pt; color: #78350f; }
      .section { padding: 12pt 32pt 0; }
      .section h2 { font-size: 12pt; color: #b45309; text-transform: uppercase; letter-spacing: 1pt; border-bottom: 1px solid #fde68a; padding-bottom: 4pt; margin-bottom: 8pt; font-weight: 700; }
      .item { margin-bottom: 10pt; }
      .item-header { display: flex; justify-content: space-between; align-items: baseline; }
      .item-header strong { font-size: 11pt; }
      .company { display: block; font-size: 9.5pt; color: #b45309; }
      .date { font-size: 9pt; color: #92400e; white-space: nowrap; }
      .desc { font-size: 9.5pt; color: #334155; margin-top: 3pt; }
      .tech { font-size: 8.5pt; color: #92400e; margin-top: 2pt; }
      ul { margin: 4pt 0 0 16pt; font-size: 9.5pt; color: #334155; list-style-type: disc; }
      li { margin-bottom: 2pt; }
      p { font-size: 9.5pt; color: #334155; }
      .skills { display: flex; flex-wrap: wrap; gap: 6pt; }
      .skill { background: #fffbeb; color: #92400e; padding: 2pt 8pt; border-radius: 10pt; font-size: 9pt; }
      .langs { display: flex; flex-wrap: wrap; gap: 12pt; }
      .lang { font-size: 9.5pt; }
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  }
};

// ═══════════════════════════════════════════════════════════════
// HTML RENDERER - Generates clean, ATS-parseable HTML
// ═══════════════════════════════════════════════════════════════

function renderHtml(cv, templateId) {
  const tpl = templates[templateId] || templates.tpl_classic;
  const p = cv.personal || {};

  // Get accent color variants
  const accentDark = tpl.accentColor;
  const accentLight = tpl.accentLight;

  // Build CSS with template colors
  const css = tpl.styles
    .replace(/ACCENT_COLOR/g, tpl.accentColor)
    .replace(/ACCENT_COLOR_DARK/g, tpl.accentColor)
    .replace(/ACCENT_LIGHT/g, tpl.accentLight)
    .replace(/SECTION_BORDER/g, tpl.sectionBorder)
    .replace(/HEADER_BG/g, tpl.headerBg);

  const sections = [];

  // ── HEADER ──
  // ATS Rule: Name, contact info, and professional title at the top
  sections.push(`
    <div class="header">
      <h1>${esc(p.fullName || 'Your Name')}</h1>
      ${p.professionalTitle ? `<p class="subtitle">${esc(p.professionalTitle)}</p>` : ''}
      <div class="contact">
        ${p.email ? `<span>${esc(p.email)}</span>` : ''}
        ${p.phone ? `<span>${esc(p.phone)}</span>` : ''}
        ${p.location ? `<span>${esc(p.location)}</span>` : ''}
        ${p.website ? `<span>${esc(p.website)}</span>` : ''}
        ${p.linkedin ? `<span>LinkedIn: ${esc(p.linkedin)}</span>` : ''}
        ${p.github ? `<span>GitHub: ${esc(p.github)}</span>` : ''}
      </div>
    </div>
  `);

  // ── PROFESSIONAL SUMMARY ──
  // ATS Rule: Include a summary with relevant keywords
  if (cv.summary) {
    sections.push(`
      <div class="section">
        <h2>Professional Summary</h2>
        <p>${esc(cv.summary)}</p>
      </div>
    `);
  }

  // ── WORK EXPERIENCE ──
  // ATS Rule: Use standard section title, list with dates, bullet points for achievements
  if (cv.experiences?.length) {
    const items = cv.experiences.map(e => `
      <div class="item">
        <div class="item-header">
          <div>
            <strong>${esc(e.position || 'Position')}</strong>
            <span class="company">${esc(e.company || 'Company')}${e.location ? ` • ${esc(e.location)}` : ''}</span>
          </div>
          <span class="date">${formatDate(e.startDate)} – ${e.current ? 'Present' : formatDate(e.endDate)}</span>
        </div>
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
        ${e.achievements?.length ? `<ul>${e.achievements.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('');
    sections.push(`<div class="section"><h2>Work Experience</h2>${items}</div>`);
  }

  // ── EDUCATION ──
  // ATS Rule: Include degree, institution, and dates
  if (cv.education?.length) {
    const items = cv.education.map(e => `
      <div class="item">
        <div class="item-header">
          <div>
            <strong>${esc(e.degree || 'Degree')}${e.fieldOfStudy ? ` in ${esc(e.fieldOfStudy)}` : ''}</strong>
            <span class="company">${esc(e.institution || 'Institution')}</span>
          </div>
          <span class="date">${formatDate(e.startDate)} – ${formatDate(e.endDate)}</span>
        </div>
        ${e.gpa ? `<p class="desc">GPA: ${esc(e.gpa)}</p>` : ''}
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
      </div>
    `).join('');
    sections.push(`<div class="section"><h2>Education</h2>${items}</div>`);
  }

  // ── SKILLS ──
  // ATS Rule: Dedicated skills section with keywords
  if (cv.skills?.length) {
    const tags = cv.skills.map(s => `<span class="skill">${esc(s.name)}${s.level ? ` (${esc(s.level)})` : ''}</span>`).join('');
    sections.push(`<div class="section"><h2>Skills</h2><div class="skills">${tags}</div></div>`);
  }

  // ── PROJECTS ──
  if (cv.projects?.length) {
    const items = cv.projects.map(proj => `
      <div class="item">
        <div class="item-header">
          <div>
            <strong>${esc(proj.name)}</strong>
            ${proj.role ? `<span class="company">${esc(proj.role)}</span>` : ''}
          </div>
        </div>
        ${proj.description ? `<p class="desc">${esc(proj.description)}</p>` : ''}
        ${proj.technologies?.length ? `<p class="tech">Technologies: ${proj.technologies.map(t => esc(t)).join(', ')}</p>` : ''}
      </div>
    `).join('');
    sections.push(`<div class="section"><h2>Projects</h2>${items}</div>`);
  }

  // ── CERTIFICATIONS ──
  if (cv.certifications?.length) {
    const items = cv.certifications.map(c => `
      <div class="item">
        <strong>${esc(c.name)}</strong>
        <span class="company">${esc(c.issuer)}${c.date ? ` • ${formatDate(c.date)}` : ''}${c.credentialId ? ` • ID: ${esc(c.credentialId)}` : ''}</span>
      </div>
    `).join('');
    sections.push(`<div class="section"><h2>Certifications</h2>${items}</div>`);
  }

  // ── LANGUAGES ──
  if (cv.languages?.length) {
    const items = cv.languages.map(l => `<span class="lang"><strong>${esc(l.language)}</strong>${l.proficiency ? ` – ${esc(l.proficiency)}` : ''}</span>`).join('');
    sections.push(`<div class="section"><h2>Languages</h2><div class="langs">${items}</div></div>`);
  }

  // ── ACHIEVEMENTS ──
  if (cv.achievements?.length) {
    const items = cv.achievements.map(a => `
      <div class="item">
        <strong>${esc(a.title)}</strong>
        <span class="company">${esc(a.organization)}${a.date ? ` • ${formatDate(a.date)}` : ''}</span>
        ${a.description ? `<p class="desc">${esc(a.description)}</p>` : ''}
      </div>
    `).join('');
    sections.push(`<div class="section"><h2>Achievements</h2>${items}</div>`);
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${css}</style>
</head>
<body>
${sections.join('\n')}
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
// PDF GENERATION - Fixed to produce valid, openable PDFs
// ═══════════════════════════════════════════════════════════════

async function generatePdf(cv, templateId) {
  if (!puppeteer) {
    throw new Error('PDF generation not available in this environment');
  }
  const html = renderHtml(cv, templateId || cv.templateId);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();

    // Set proper viewport
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Set content with proper encoding
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    const pdfUint8 = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      timeout: 30000
    });

    // CRITICAL: page.pdf() returns Uint8Array, must convert to Buffer
    return Buffer.from(pdfUint8.buffer, pdfUint8.byteOffset, pdfUint8.byteLength);
  } finally {
    await browser.close();
  }
}

// ═══════════════════════════════════════════════════════════════
// ATS ANALYSIS - Real-time scoring for CV content
// ═══════════════════════════════════════════════════════════════

function analyzeAtsReadiness(cv) {
  const tips = [];
  let score = 0;

  // 1. Contact Information (20 points)
  const contactScore = analyzeContactInfo(cv.personal);
  score += contactScore.score;
  tips.push(...contactScore.tips);

  // 2. Professional Summary (15 points)
  const summaryScore = analyzeSummary(cv.summary);
  score += summaryScore.score;
  tips.push(...summaryScore.tips);

  // 3. Work Experience (25 points)
  const expScore = analyzeExperience(cv.experiences);
  score += expScore.score;
  tips.push(...expScore.tips);

  // 4. Education (15 points)
  const eduScore = analyzeEducation(cv.education);
  score += eduScore.score;
  tips.push(...eduScore.tips);

  // 5. Skills (15 points)
  const skillScore = analyzeSkills(cv.skills);
  score += skillScore.score;
  tips.push(...skillScore.tips);

  // 6. Formatting (10 points)
  const formatScore = analyzeFormatting(cv);
  score += formatScore.score;
  tips.push(...formatScore.tips);

  return {
    score: Math.min(Math.round(score), 100),
    breakdown: {
      contact: contactScore,
      summary: summaryScore,
      experience: expScore,
      education: eduScore,
      skills: skillScore,
      formatting: formatScore
    },
    tips,
    isAtsFriendly: score >= 70
  };
}

function analyzeContactInfo(personal) {
  let score = 0;
  const tips = [];
  const details = [];

  if (!personal) {
    return { score: 0, tips: ['Add your personal information (name, email, phone)'], details: ['✗ No personal info'] };
  }

  if (personal.fullName) { score += 4; details.push('✓ Full name present'); }
  else { tips.push('Add your full name'); details.push('✗ No full name'); }

  if (personal.email) { score += 4; details.push('✓ Email present'); }
  else { tips.push('Add your email address'); details.push('✗ No email'); }

  if (personal.phone) { score += 4; details.push('✓ Phone present'); }
  else { tips.push('Add your phone number'); details.push('✗ No phone'); }

  if (personal.location) { score += 3; details.push('✓ Location present'); }
  else { tips.push('Add your location/city'); details.push('✗ No location'); }

  if (personal.linkedin) { score += 3; details.push('✓ LinkedIn present'); }
  else { tips.push('Add your LinkedIn URL'); details.push('✗ No LinkedIn'); }

  if (personal.professionalTitle) { score += 2; details.push('✓ Title present'); }

  return { score: Math.min(score, 20), tips, details };
}

function analyzeSummary(summary) {
  let score = 0;
  const tips = [];
  const details = [];

  if (!summary) {
    return { score: 0, tips: ['Add a professional summary (2-4 sentences)'], details: ['✗ No summary'] };
  }

  const wordCount = summary.split(/\s+/).length;
  if (wordCount >= 20) { score += 8; details.push('✓ Good summary length'); }
  else { tips.push('Make your summary longer (20-50 words recommended)'); details.push('~ Summary too short'); }

  if (wordCount <= 60) { score += 4; details.push('✓ Summary is concise'); }
  else { tips.push('Keep your summary under 60 words'); details.push('~ Summary may be too long'); }

  // Check for power words
  const powerWords = ['experienced', 'skilled', 'passionate', 'results-driven', 'detail-oriented', 'collaborative', 'innovative', 'dedicated', 'accomplished', 'proficient'];
  const hasPowerWords = powerWords.some(w => summary.toLowerCase().includes(w));
  if (hasPowerWords) { score += 3; details.push('✓ Contains professional keywords'); }
  else { tips.push('Include professional keywords in your summary'); details.push('~ No power words found'); }

  return { score: Math.min(score, 15), tips, details };
}

function analyzeExperience(experiences) {
  let score = 0;
  const tips = [];
  const details = [];

  if (!experiences?.length) {
    return { score: 0, tips: ['Add your work experience'], details: ['✗ No experience'] };
  }

  // Has experience entries
  score += 5;
  details.push(`✓ ${experiences.length} experience(s) listed`);

  // Check for dates - each experience should have startDate
  const withDates = experiences.filter(e => e.startDate);
  if (withDates.length === experiences.length) {
    score += 5;
    details.push('✓ All entries have dates');
  } else if (withDates.length > 0) {
    score += 3;
    tips.push('Add start dates for all experience entries');
    details.push(`~ ${withDates.length}/${experiences.length} entries have dates`);
  } else {
    tips.push('Add start dates for all experience entries');
    details.push('✗ No dates found');
  }

  // Check for achievements/bullet points - EACH experience should have achievements
  const withAchievements = experiences.filter(e => e.achievements?.length > 0);
  if (withAchievements.length === experiences.length) {
    score += 5;
    details.push(`✓ All entries have achievement bullet points`);
  } else if (withAchievements.length > 0) {
    score += 3;
    tips.push('Add achievement bullet points for all experience entries');
    details.push(`~ ${withAchievements.length}/${experiences.length} entries have bullet points`);
  } else {
    tips.push('Add achievement bullet points (use action verbs + quantified results)');
    details.push('✗ No achievement bullet points found');
  }

  // Check for quantified achievements
  const allAchievements = experiences.flatMap(e => e.achievements || []);
  const hasQuantified = allAchievements.some(a => /\d+%|\d+\+|\$|\d+\s*(years?|months?|projects?|users?|customers?|team|daily|monthly)/i.test(a));
  if (hasQuantified) { score += 5; details.push('✓ Has quantified achievements'); }
  else { tips.push('Quantify your achievements (e.g., "Increased sales by 25%")'); details.push('✗ No quantified achievements'); }

  // Check descriptions
  const withDescriptions = experiences.filter(e => e.description);
  if (withDescriptions.length === experiences.length) {
    score += 5;
    details.push('✓ All entries have descriptions');
  } else {
    tips.push('Add descriptions for each experience entry');
    details.push('✗ Some entries missing descriptions');
  }

  return { score: Math.min(score, 25), tips, details };
}

function analyzeEducation(education) {
  let score = 0;
  const tips = [];
  const details = [];

  if (!education?.length) {
    return { score: 0, tips: ['Add your education details'], details: ['✗ No education'] };
  }

  score += 8;
  details.push(`✓ ${education.length} education entry/entries`);

  const hasDegree = education.every(e => e.degree);
  if (hasDegree) { score += 4; details.push('✓ All entries have degree'); }
  else { tips.push('Add degree information for all education entries'); details.push('✗ Some entries missing degree'); }

  const hasInstitution = education.every(e => e.institution);
  if (hasInstitution) { score += 3; details.push('✓ All entries have institution'); }
  else { tips.push('Add institution names'); details.push('✗ Some entries missing institution'); }

  return { score: Math.min(score, 15), tips, details };
}

function analyzeSkills(skills) {
  let score = 0;
  const tips = [];
  const details = [];

  if (!skills?.length) {
    return { score: 0, tips: ['Add a skills section with relevant keywords'], details: ['✗ No skills'] };
  }

  score += 5;
  details.push(`✓ ${skills.length} skill(s) listed`);

  if (skills.length >= 5) { score += 4; details.push('✓ Good number of skills'); }
  else { tips.push('Add more skills (aim for 5-15 relevant skills)'); details.push('~ Few skills listed'); }

  // Check for levels
  const hasLevels = skills.some(s => s.level);
  if (hasLevels) { score += 3; details.push('✓ Skill levels specified'); }
  else { tips.push('Add skill levels (e.g., Advanced, Expert)'); details.push('✗ No skill levels'); }

  // Check for categories
  const hasCategories = skills.some(s => s.category);
  if (hasCategories) { score += 3; details.push('✓ Skills categorized'); }
  else { tips.push('Categorize skills (e.g., Frontend, Backend, DevOps)'); details.push('✗ No skill categories'); }

  return { score: Math.min(score, 15), tips, details };
}

function analyzeFormatting(cv) {
  let score = 0;
  const tips = [];
  const details = [];

  // Has professional title
  if (cv.personal?.professionalTitle) { score += 3; details.push('✓ Professional title present'); }
  else { tips.push('Add a professional title'); details.push('✗ No professional title'); }

  // Has template selected
  if (cv.templateId) { score += 3; details.push(`✓ Template selected: ${cv.templateId}`); }

  // Has sections - count all available sections
  const sectionCount = [
    cv.summary,
    cv.experiences?.length > 0,
    cv.education?.length > 0,
    cv.skills?.length > 0,
    cv.projects?.length > 0,
    cv.certifications?.length > 0,
    cv.languages?.length > 0,
    cv.achievements?.length > 0
  ].filter(Boolean).length;

  if (sectionCount >= 4) { score += 4; details.push(`✓ ${sectionCount} sections filled`); }
  else { tips.push('Fill in more sections (aim for 4+ sections)'); details.push(`~ Only ${sectionCount} sections filled`); }

  return { score: Math.min(score, 10), tips, details };
}

module.exports = { generatePdf, renderHtml, analyzeAtsReadiness, templates };
