import { generatePdf } from "./generatePdf";

export const handlePrint = (item, user) => {
  const dataToPrint = {
    nim: item.nim,
    nama: item.nama,
    angkatan: item.angkatan,
    jenisBayar: item.jenis_bayar,
    caraBayar: item.cara_bayar,
    nominal: item.nominal,
    keteranganBayar: item.keterangan_bayar,
    terbilang: item.terbilang,
    createdAt: item.createdAt
  };
  generatePdf(dataToPrint, user);
};
