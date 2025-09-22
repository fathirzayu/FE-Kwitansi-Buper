export function toTerbilang(n) {
  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];

  n = parseInt(n);
  if (n < 12) return satuan[n];
  else if (n < 20) return satuan[n - 10] + " Belas";
  else if (n < 100) return toTerbilang(Math.floor(n / 10)) + " Puluh " + toTerbilang(n % 10);
  else if (n < 200) return "Seratus " + toTerbilang(n - 100);
  else if (n < 1000) return toTerbilang(Math.floor(n / 100)) + " Ratus " + toTerbilang(n % 100);
  else if (n < 2000) return "Seribu " + toTerbilang(n - 1000);
  else if (n < 1000000) return toTerbilang(Math.floor(n / 1000)) + " Ribu " + toTerbilang(n % 1000);
  else if (n < 1000000000) return toTerbilang(Math.floor(n / 1000000)) + " Juta " + toTerbilang(n % 1000000);
  else return "";
}
