import type { CartItem } from '$lib/cart.svelte';
import type { Company } from '$lib/company.svelte';

// Génère et télécharge le PDF de demande à partir du contenu du panier
export async function downloadCartPdf(items: CartItem[], company: Company | null) {
  // Chargé à la demande : évite d'alourdir toutes les pages
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const now = new Date();
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Demande', 14, 20);
  doc.setFontSize(11);
  if (company) doc.text(company.name, 14, 30);
  doc.text(`Date : ${now.toLocaleDateString('fr-FR')}`, 14, 36);

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

  doc.save(`demande-${now.toISOString().slice(0, 10)}.pdf`);
}
