
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const content = {"executive_summary": "This proposal outlines a comprehensive access control and surveillance solution for Matrix Comsec, designed to meet the specific requirements of a manufacturing facility. Leveraging the COSEC CENTRA Platform, we offer a robust, scalable, and secure solution that enhances operational efficiency, protects valuable assets, and ensures compliance. Our recommended products \u2013 COSEC CENTRA PLATFORM (10 units), COSEC CENTRA ACM10 (10 units), COSEC CENTRA PLATFORM (10 units), COSEC ATOM RD100E (10 units), COSEC ATOM RD300SFE (10 units), and COSEC VYOM TAM UD10K (10 units) \u2013 address critical security concerns, streamline administration, and provide a reliable foundation for long-term success.  The investment represents a strategic move to protect assets, improve operational control, and solidify Matrix Comsec\u2019s position within the manufacturing sector.", "understanding_needs": "Matrix Comsec is a manufacturing facility requiring a robust and adaptable access control and surveillance system. Key needs include:\n\n*   **Comprehensive Security:** Protecting valuable equipment, materials, and intellectual property from unauthorized access.\n*   **Real-time Monitoring:**  Tracking personnel and assets within the facility for security and operational efficiency.\n*   **Scalability:**  The system must be able to accommodate future expansion and increased security requirements.\n*   **Compliance:** Adherence to industry regulations and internal policies regarding access control.\n*   **Integration:** Seamless integration with existing card reader infrastructure and potentially other security systems.\n*   **Remote Management:**  The ability to remotely monitor and manage the system from a central location.\n*   **Audit Trails:**  Detailed records of all access events for compliance and investigation.\n*   **Cost-Effectiveness:**  A solution that balances security features with a reasonable total cost of ownership.", "proposed_solution": "We propose a centralized solution utilizing the COSEC CENTRA Platform as the core of the system. This platform will provide:\n\n*   **COSEC CENTRA PLATFORM (10 Units):**  The central hub for managing all access control, surveillance, and time tracking devices.  It will integrate with existing card readers and provide a unified interface for administration.\n*   **COSEC CENTRA ACM10 (10 Units):**  Critical for network security, providing biometric authentication for enhanced access control.\n*   **COSEC CENTRA PLATFORM (10 Units):**  Centralized management of all devices, simplifying administration and ensuring consistent policy enforcement.\n*   **COSEC ATOM RD100E (10 Units):**  Versatile reader for deployment across the facility, supporting EM Prox Card, BLE, and Wiegand compatibility for future expansion.\n*   **COSEC ATOM RD300SFE (10 Units):**  High-security reader for sensitive areas, offering fingerprint, EM card, and PIN authentication.\n*   **COSEC VYOM TAM UD10K (10 Units):**  Cloud-based access management solution for simplified deployment and management, integrating with existing IT infrastructure.\n\nThis approach ensures a streamlined, secure, and scalable solution tailored to Matrix Comsec\u2019s specific operational needs.", "product_recommendations": "Based on the requirements outlined, we recommend the following products:\n\n*   **COSEC CENTRA PLATFORM:**  The cornerstone of the system, providing centralized management and integration capabilities.\n*   **COSEC CENTRA ACM10:**  Essential for securing the network and implementing biometric authentication.\n*   **COSEC CENTRA PLATFORM:**  Streamlines administration and ensures consistent policy enforcement.\n*   **COSEC ATOM RD100E:**  Provides robust access control and time tracking capabilities.\n*   **COSEC ATOM RD300SFE:**  Offers high-security access control for sensitive areas.\n*   **COSEC VYOM TAM UD10K:**  Simplifies deployment and management, leveraging cloud technology.\n\nThese products are carefully selected to complement each other and provide a comprehensive security solution.", "implementation_plan": "The implementation will be phased to minimize disruption:\n\n1.  **Assessment & Planning (2 weeks):** Detailed site survey, system configuration, and integration planning.\n2.  **Hardware Installation (4 weeks):** COSEC CENTRA Platform installation, COSEC CENTRA ACM10, COSEC ATOM RD100E, COSEC ATOM RD300SFE, and COSEC VYOM TAM UD10K deployment.\n3.  **Network Integration (2 weeks):**  Integration with existing card reader infrastructure.\n4.  **User Training (1 week):**  Training for facility personnel on system operation and security protocols.\n5.  **Testing & Validation (1 week):**  Thorough testing to ensure system functionality and security.\n6.  **Ongoing Support & Maintenance (Ongoing):**  Regular maintenance and support to ensure optimal performance and security.\n\nWe will provide detailed documentation and support throughout the implementation process.", "investment_summary": "The total investment for the proposed solution is $201,240.00. This investment represents a strategic investment in Matrix Comsec\u2019s security and operational efficiency, providing a robust and scalable solution for years to come.  We believe this investment will significantly reduce risk, improve compliance, and contribute to the long-term success of the facility.  A detailed breakdown of costs is available upon request."};
const clientInfo = {"company_name": "Matrix Comsec", "industry": "Manufacturing", "company_size": "200\u20131000", "location": {"city": "Vadodara", "state": "Gujarat", "country": "India"}, "budget_range": "\u20b95L\u2013\u20b920L"};
const products = [{"product_name": "COSEC CENTRA PLATFORM", "category": "Software License", "quantity": 10, "unit_price": 500.0, "justification": "The COSEC CENTRA Platform offers a comprehensive solution for access control, time tracking, and surveillance, aligning perfectly with the client's requirements. Its on-premise deployment, robust features, and scalability make it a strong choice for a manufacturing environment. The 10-year warranty and comprehensive features are particularly valuable for ensuring long-term security and compliance.", "technical_fit_score": 90}, {"product_name": "COSEC CENTRA ACM10", "category": "Software License", "quantity": 10, "unit_price": 170.0, "justification": "The COSEC CENTRA ACM10 is a critical component for the client's network security. Its 10-inch face device compatible with biometric authentication is essential for implementing comprehensive access control and time attendance. The integration with existing card reader infrastructure further streamlines the system's deployment and operation.", "technical_fit_score": 85}, {"product_name": "COSEC CENTRA PLATFORM", "category": "Software License", "quantity": 10, "unit_price": 500.0, "justification": "The COSEC CENTRA Platform provides a centralized solution for managing all access control and surveillance devices. This simplifies administration, enhances security, and ensures consistent policy enforcement across all buildings. Its ability to integrate with various access control systems and provide detailed audit trails is a significant advantage.", "technical_fit_score": 85}, {"product_name": "COSEC ATOM RD100E", "category": "Reader", "quantity": 10, "unit_price": 3800.0, "justification": "The COSEC ATOM RD100E is a versatile reader that can be deployed in various locations within the manufacturing facility. Its compact design, IP65 rating, and support for EM Prox Card, BLE, and Wiegand ensure compatibility with the client's existing infrastructure and future expansion needs. The ability to integrate with other security systems is a key benefit.", "technical_fit_score": 80}, {"product_name": "COSEC ATOM RD300SFE", "category": "Reader", "quantity": 10, "unit_price": 11000.0, "justification": "The COSEC ATOM RD300SFE is a high-security reader designed for data rooms and other sensitive areas. Its fingerprint, EM card, and PIN authentication features provide robust protection against unauthorized access. The IP65/IK06 rating ensures reliable operation in challenging environments.", "technical_fit_score": 80}, {"product_name": "COSEC VYOM TAM UD10K", "category": "Cloud Software", "quantity": 10, "unit_price": 800.0, "justification": "The COSEC VYOM TAM UD10K is a cloud-based access management solution that simplifies the deployment and management of access control systems. It integrates seamlessly with the client's existing IT infrastructure and provides a centralized platform for monitoring and control. The 24x7 availability and failover capabilities are particularly beneficial for a manufacturing environment.", "technical_fit_score": 75}];
const pricing = {"subtotal_products": 167700.0, "installation_cost": 33540.0, "maintenance_annual": 25155.0, "total_investment": 201240.0, "sla_tier": "Premium"};

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
