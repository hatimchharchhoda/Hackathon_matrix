
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const content = {"executive_summary": "This proposal outlines a strategic investment in advanced access control solutions from Adani, specifically focusing on COSEC products designed to enhance security and operational efficiency within manufacturing facilities.  The proposed solution leverages the robust and versatile capabilities of COSEC\u2019s ATOM RD100E readers, offering a comprehensive approach to visitor management, data room security, and IT room control.  This investment directly addresses stringent access requirements, improves operational safety, and provides a scalable, reliable, and secure access control system for a modern manufacturing environment.  We anticipate a significant return on investment through reduced risk, streamlined workflows, and enhanced data protection.", "understanding_needs": "Manufacturing facilities face increasing demands for robust security protocols to protect sensitive data, control access to critical areas, and ensure employee safety. Current access control methods often lack the flexibility and scalability needed to accommodate evolving operational needs.  Key needs include:\n\n*   **Stringent Access Control:**  Maintaining strict control over who can enter specific areas, particularly data rooms and IT rooms.\n*   **Biometric Authentication:**  Implementing multi-factor authentication (fingerprint, EM card, BLE) for enhanced security.\n*   **Visitor Management:**  Streamlining visitor entry and exit processes, minimizing potential security risks.\n*   **Scalability:**  The ability to easily expand access control capabilities as the facility grows.\n*   **Reliability:**  A system that can withstand demanding operational environments and minimize downtime.\n*   **Integration:** Seamless integration with existing ANPR and boom barrier systems.\n*   **Data Room Security:** Protecting sensitive data within the data room.\n*   **IT Room Control:** Secure access to IT resources.\n*   **Cost-Effectiveness:** Balancing security with budgetary constraints.\n\nAdani\u2019s COSEC products are specifically engineered to address these needs, offering a superior combination of features, performance, and reliability.", "proposed_solution": "We recommend a phased implementation of COSEC products, prioritizing the following:\n\n*   **COSEC ATOM RD100E (12):**  For data rooms and IT rooms, providing robust biometric authentication and IP65 rating for reliable operation.\n*   **COSEC PATH DCFE (10):**  For smaller departments or areas requiring a more comprehensive system, offering a cost-effective single-door solution with PIN fallback.\n*   **COSEC ARGO FACEE (12):**  For visitor access control, leveraging EM card and BLE authentication for a secure and convenient entry point.\n*   **COSEC ATOM RD100E (10):**  For wider facility deployment, offering a versatile solution for various applications.\n*   **COSEC ARC DC200P (10):**  For multi-building environments, providing flexibility and adaptability to different layouts.\n\nThis solution leverages Adani\u2019s commitment to innovation and provides a tailored approach to meet the specific requirements of each facility.\n\n**Technical Specifications:**\n*   COSEC ATOM RD100E: Dual-factor authentication (fingerprint, EM card, BLE), IP65 rating, QR e-pass functionality.\n*   COSEC PATH DCFE: Single-door controller, keypad-based PIN fallback, ANPR and boom barrier integration.\n*   COSEC ARGO FACEE: Face recognition, EM card and BLE authentication, IP65 rating.\n*   COSEC ARC DC200P: Compact design, multi-door management, IP65 rating, keypad-based PIN fallback.\n*   COSEC ATOM RD100E: Dual-factor authentication, IP65 rating, QR e-pass functionality.\n\n  **Total Investment:** $677,520.00\n\n  **Expected Benefits:** Reduced risk of data breaches, streamlined visitor management, improved operational efficiency, enhanced data protection, and a scalable access control solution.", "product_recommendations": "We strongly recommend the COSEC ATOM RD100E readers as the primary solution for this project. Their robust design, dual-factor authentication capabilities, and IP65 rating make them ideal for a manufacturing facility with stringent access control requirements.  The COSEC PATH DCFE offers a cost-effective alternative for smaller departments, while the COSEC ARGO FACEE provides a secure and convenient visitor access solution.  The COSEC ARC DC200P is a valuable addition for multi-building environments, and the COSEC ATOM RD100E provides a versatile solution for a wide range of applications.  Adani\u2019s commitment to quality and reliability ensures a long-term investment in a secure and efficient access control system.", "implementation_plan": "Our implementation plan will involve:\n\n1.  **Assessment:**  Detailed assessment of existing access control infrastructure and facility layout.\n2.  **System Design:**  Customized system design based on facility requirements.\n3.  **Hardware Installation:**  Installation of COSEC ATOM RD100E readers, COSEC PATH DCFE controllers, and COSEC ARGO FACEE.\n4.  **Software Configuration:**  Configuration of access control software and integration with existing systems.\n5.  **Training:**  Training for facility personnel on system operation and maintenance.\n6.  **Testing & Validation:**  Thorough testing and validation to ensure system functionality.\n7.  **Ongoing Support:**  Dedicated support and maintenance services.\n\nWe will work closely with the client to ensure a smooth and successful implementation.\n\n**Timeline:**  Estimated implementation timeframe: 8-12 weeks.\n\n**Budget Breakdown:**  (Detailed breakdown will be provided upon request, including hardware, software, installation, training, and ongoing support.)", "investment_summary": "The proposed investment of $677,520.00 represents a strategic investment in a robust and scalable access control solution from Adani.  This investment will significantly reduce risk, streamline operations, and enhance data protection, ultimately contributing to improved operational efficiency and a secure manufacturing environment.  We are confident that this solution will deliver a strong return on investment through reduced security incidents, improved compliance, and enhanced productivity.  We are prepared to provide a detailed cost-benefit analysis and customized implementation plan to meet the specific needs of your facility."};
const clientInfo = {"company_name": "adani", "industry": "Manufacturing", "company_size": "50\u2013200", "location": {"city": "Ahmedabad", "state": "Gujarat", "country": "India"}, "budget_range": "\u20b95L\u2013\u20b920L"};
const products = [{"product_name": "COSEC ATOM RD100E", "category": "Reader", "quantity": 12, "unit_price": 3800.0, "justification": "This reader offers a robust and versatile solution for data rooms, supporting multiple biometric authentication methods (fingerprint, EM card, and BLE) and is IP65 rated for reliable operation in demanding environments. Its dual-factor authentication capability enhances security significantly, making it a strong choice for a manufacturing facility with stringent access control requirements.", "technical_fit_score": 90}, {"product_name": "COSEC PATH DCFE", "category": "Single-Door Controller", "quantity": 10, "unit_price": 12500.0, "justification": "The COSEC PATH DCFE is a cost-effective, single-door controller ideal for smaller departments or areas where a more comprehensive system isn't immediately required. Its keypad-based PIN fallback provides an additional layer of security, particularly useful in situations where card-based authentication is unreliable.  It integrates seamlessly with ANPR and boom barriers, enhancing overall facility security.", "technical_fit_score": 85}, {"product_name": "COSEC ARGO FACEE", "category": "Terminal", "quantity": 12, "unit_price": 19000.0, "justification": "The COSEC ARGO FACEE is a compelling choice for a manufacturing facility prioritizing visitor access control. Its face recognition capabilities, combined with EM card and BLE authentication, provide a secure and convenient entry point.  The IP65 rating ensures durability in a potentially harsh environment, and the QR e-pass functionality streamlines the visitor process.  It's a good fit for a facility needing a balance of security and ease of use.", "technical_fit_score": 90}, {"product_name": "COSEC ATOM RD100E", "category": "Reader", "quantity": 10, "unit_price": 3800.0, "justification": "The COSEC ATOM RD100E is a versatile reader that can be deployed in various locations within the facility. Its dual-factor authentication and IP65 rating make it suitable for a wide range of applications, including data rooms, IT rooms, and potentially even restricted zones.  It's a solid investment for a facility needing a reliable and secure access control solution.", "technical_fit_score": 80}, {"product_name": "COSEC ARC DC200P", "category": "Door Controller", "quantity": 10, "unit_price": 9000.0, "justification": "The COSEC ARC DC200P is a compact and reliable door controller designed for multi-building environments. Its ability to manage up to 255 door controllers provides flexibility, and its standalone and network modes offer adaptability to different facility layouts.  The IP65 rating ensures robust operation in a demanding environment, and the keypad-based PIN fallback adds an extra layer of security.", "technical_fit_score": 85}, {"product_name": "COSEC ATOM RD100E", "category": "Reader", "quantity": 10, "unit_price": 3800.0, "justification": "The COSEC ATOM RD100E is a versatile reader that can be deployed in various locations within the facility. Its dual-factor authentication and IP65 rating make it suitable for a wide range of applications, including data rooms, IT rooms, and potentially even restricted zones.  It's a solid investment for a facility needing a reliable and secure access control solution.", "technical_fit_score": 80}];
const pricing = {"subtotal_products": 564600.0, "installation_cost": 112920.0, "maintenance_annual": 84690.0, "total_investment": 677520.0, "sla_tier": "Premium"};

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: "PROPOSAL", size: 48, bold: true, color: "2E75B6" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2880 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Security & Telecom Solutions", size: 32, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 720 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Prepared for:", size: 24, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: clientInfo.company_name, size: 28, bold: true, color: "2E75B6" })],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [new TextRun({ text: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), size: 20, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 240 }
      }),
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ children: [new TextRun(content.executive_summary || "Executive summary...")], spacing: { after: 240 } }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Understanding Your Needs")] }),
      new Paragraph({ children: [new TextRun(content.understanding_needs || "Requirements...")], spacing: { after: 240 } }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Proposed Solution")] }),
      new Paragraph({ children: [new TextRun(content.proposed_solution || "Solution...")], spacing: { after: 240 } }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Product Recommendations")] }),
      new Paragraph({ children: [new TextRun(content.product_recommendations || "Products...")], spacing: { after: 240 } }),
      
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3744, 1872, 1872, 1872],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3744, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Product", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Unit Price", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          ...products.map((p, i) => new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3744, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F9F9F9" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun(p.product_name)] })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F9F9F9" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun(p.quantity.toString())], alignment: AlignmentType.CENTER })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F9F9F9" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("$" + p.unit_price.toLocaleString('en-US', {minimumFractionDigits: 2}))], alignment: AlignmentType.RIGHT })] }),
              new TableCell({ borders, width: { size: 1872, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "F9F9F9" : "FFFFFF", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("$" + (p.quantity * p.unit_price).toLocaleString('en-US', {minimumFractionDigits: 2}))], alignment: AlignmentType.RIGHT })] })
            ]
          }))
        ]
      }),
      
      new Paragraph({ text: "", spacing: { after: 480 } }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation Plan")] }),
      new Paragraph({ children: [new TextRun(content.implementation_plan || "Implementation...")], spacing: { after: 240 } }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Investment Summary")] }),
      new Paragraph({ children: [new TextRun(content.investment_summary || "Investment...")], spacing: { after: 240 } }),
      
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [6552, 2808],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 6552, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Products & Equipment", bold: true })] })] }),
            new TableCell({ borders, width: { size: 2808, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun("$" + pricing.subtotal_products.toLocaleString('en-US', {minimumFractionDigits: 2}))], alignment: AlignmentType.RIGHT })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 6552, type: WidthType.DXA }, shading: { fill: "F9F9F9", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Installation & Configuration", bold: true })] })] }),
            new TableCell({ borders, width: { size: 2808, type: WidthType.DXA }, shading: { fill: "F9F9F9", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun("$" + pricing.installation_cost.toLocaleString('en-US', {minimumFractionDigits: 2}))], alignment: AlignmentType.RIGHT })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 6552, type: WidthType.DXA }, shading: { fill: "E8F4F8", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "TOTAL INVESTMENT", bold: true, size: 26 })] })] }),
            new TableCell({ borders, width: { size: 2808, type: WidthType.DXA }, shading: { fill: "E8F4F8", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "$" + pricing.total_investment.toLocaleString('en-US', {minimumFractionDigits: 2}), bold: true, size: 26 })], alignment: AlignmentType.RIGHT })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 6552, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun("Annual Maintenance (" + pricing.sla_tier + " SLA)")] })] }),
            new TableCell({ borders, width: { size: 2808, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun("$" + pricing.maintenance_annual.toLocaleString('en-US', {minimumFractionDigits: 2}) + "/year")], alignment: AlignmentType.RIGHT })] })
          ] })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/Users/hatim/.gemini/antigravity/scratch/agent_server/proposal_techcorp.docx', buffer);
  console.log('Document created');
});
