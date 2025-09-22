export const generatePdf = async (data, admins) => {
  const res = await fetch("/kwitansi.html");
  let html = await res.text();

  // Gunakan tanggal dari createdAt jika ada, atau tanggal sekarang
  const dateSource = data.createdAt ? new Date(data.createdAt) : new Date();
  const formattedDate = dateSource.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const noKwitansi = `KW-${data.nim}-${formattedDate.replaceAll("/", "")}`;

  html = html.replace(/{{nim}}/g, data.nim)
             .replace(/{{nama}}/g, data.nama)
             .replace(/{{angkatan}}/g, data.angkatan)
             .replace(/{{jenisBayar}}/g, data.jenisBayar)
             .replace(/{{caraBayar}}/g, data.caraBayar)
             .replace(/{{keteranganBayar}}/g, data.keteranganBayar)
             .replace(/{{nominal}}/g, data.nominal)
             .replace(/{{terbilang}}/g, data.terbilang)
             .replace(/{{petugas}}/g, admins?.fullname || "-")
             .replace(/{{jabatan}}/g, admins?.jabatan || "-")
             .replace(/{{tanggal}}/g, formattedDate)
             .replace(/{{noKwitansi}}/g, noKwitansi);

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};
