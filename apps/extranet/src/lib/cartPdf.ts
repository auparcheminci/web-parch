import type { CartItem } from '$lib/cart.svelte';
import type { Company } from '$lib/company.svelte';

// Génère le PDF de la proforma à partir du contenu du panier
export async function buildCartPdf(items: CartItem[], company: Company, date: Date) {
  // Chargé à la demande : évite d'alourdir toutes les pages
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Proforma', 14, 20);
  doc.setFontSize(11);
  doc.text(company.name, 14, 30);
  doc.text(`Date : ${date.toLocaleDateString('fr-FR')}`, 14, 36);

  autoTable(doc, {
    startY: 44,
    head: [['Désignation', 'Référence', 'Quantité']],
    body: items.map((item) => [item.designation, item.reference ?? '', String(item.quantity)]),
    foot: [['Total', '', String(items.reduce((total, item) => total + item.quantity, 0))]],
    columnStyles: { 2: { halign: 'right' } },
    // Bleu de la charte ($blue-vivid-scale 1500)
    headStyles: { fillColor: '#435ca9' },
    footStyles: { fillColor: '#435ca9' },
    // columnStyles ne s'applique pas à l'en-tête ni au pied du tableau
    didParseCell: ({ cell, column }) => {
      if (column.index === 2) cell.styles.halign = 'right';
    },
  });

  return doc.output('blob');
}
