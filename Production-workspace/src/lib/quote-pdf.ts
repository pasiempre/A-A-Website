type QuotePdfInput = {
  quoteNumber: string;
  createdAt: string;
  validUntil?: string | null;
  clientName: string;
  companyName?: string | null;
  address?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  scopeDescription?: string | null;
  lineItems: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
};

type PdfLine = {
  text: string;
  size?: number;
  bold?: boolean;
};

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function wrapText(value: string, maxLength: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function buildPdfText(lines: PdfLine[]) {
  const commands: string[] = [];
  let isFirst = true;

  for (const line of lines) {
    const font = line.bold ? "/F2" : "/F1";
    const size = line.size ?? 11;
    if (isFirst) {
      commands.push("BT");
      commands.push(`${font} ${size} Tf`);
      commands.push("50 770 Td");
      commands.push(`(${escapePdfText(line.text)}) Tj`);
      isFirst = false;
      continue;
    }

    commands.push("0 -16 Td");
    commands.push(`${font} ${size} Tf`);
    commands.push(`(${escapePdfText(line.text)}) Tj`);
  }

  commands.push("ET");
  return commands.join("\n");
}

export function buildQuotePdf(input: QuotePdfInput) {
  const lines: PdfLine[] = [
    { text: "A&A Cleaning Services Quote", size: 22, bold: true },
    { text: `Quote #: ${input.quoteNumber}`, bold: true },
    { text: `Created: ${new Date(input.createdAt).toLocaleDateString()}` },
  ];

  if (input.validUntil) {
    lines.push({ text: `Valid Until: ${new Date(input.validUntil).toLocaleDateString()}` });
  }

  lines.push(
    { text: "" },
    { text: `Client: ${input.clientName}`, bold: true },
    { text: `Company: ${input.companyName || input.clientName}` },
  );

  if (input.address) {
    for (const row of wrapText(`Address: ${input.address}`, 78)) {
      lines.push({ text: row });
    }
  }
  if (input.contactEmail) {
    lines.push({ text: `Email: ${input.contactEmail}` });
  }
  if (input.contactPhone) {
    lines.push({ text: `Phone: ${input.contactPhone}` });
  }
  if (input.scopeDescription) {
    lines.push({ text: "" }, { text: "Scope", bold: true });
    for (const row of wrapText(input.scopeDescription, 78)) {
      lines.push({ text: row });
    }
  }

  lines.push({ text: "" }, { text: "Line Items", bold: true });
  for (const lineItem of input.lineItems) {
    for (const row of wrapText(lineItem.description, 52)) {
      lines.push({ text: row });
    }
    lines.push({
      text: `${lineItem.quantity.toFixed(2)} ${lineItem.unit} x ${money(lineItem.unitPrice)} = ${money(lineItem.lineTotal)}`,
    });
  }

  lines.push(
    { text: "" },
    { text: `Subtotal: ${money(input.subtotal)}`, bold: true },
    { text: `Tax: ${money(input.taxAmount)}` },
    { text: `Total: ${money(input.total)}`, size: 13, bold: true },
  );

  if (input.notes) {
    lines.push({ text: "" }, { text: "Notes", bold: true });
    for (const row of wrapText(input.notes, 78)) {
      lines.push({ text: row });
    }
  }

  const content = buildPdfText(lines);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf-8");
}
