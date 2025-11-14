import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  useToast,
  Spinner,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Textarea,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { toTerbilang } from "../../helper/helperTerbilang";
import { generatePdf } from "../../helper/generatePdf";
import { useSelector } from "react-redux";
import { fetchStudentByNim, submitKwitansi } from "../../api/listEndpoint";

export const ModalKwitansi = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.value);
  const toast = useToast();
  const [, setTerbilang] = useState("");
  const [nimInput, setNimInput] = useState("");
  const [dataMhs, setDataMhs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);

  const formikRef = React.useRef();

  // Configuration arrays
  const jenisBayar = [
    "BIAYA PENDAFTARAN",
    "BIAYA PENGEMBANGAN",
    "BIAYA SEMESTER",
    "BIAYA SEMESTER 1",
    "BIAYA SEMESTER 2",
    "BIAYA SEMESTER 3",
    "BIAYA SEMESTER 4",
    "BIAYA SEMESTER 5",
    "BIAYA SEMESTER 6",
    "BIAYA SEMESTER 7",
    "BIAYA SEMESTER 8",
    "BIAYA AKHIR",
    "BIAYA REMEDIAL",
    "BIAYA KKN",
    "BIAYA KONVERSI",
    "FOTO WISUDA",
    "TAMBAHAN UNDANGAN WISUDA",
  ];

  const keteranganBayar = ["CICILAN", "LUNAS"];
  const caraPembayaran = ["TRANSFER", "CASH", "QRIS"];

  // Validation schema
  const CreateSchema = Yup.object().shape({
    nim: Yup.string()
      .matches(/^\d+$/, "NIM harus berupa angka")
      .min(8, "NIM minimal 8 digit")
      .required("NIM wajib diisi"),
    nama: Yup.string()
      .min(3, "Nama minimal 3 karakter")
      .required("Nama mahasiswa wajib diisi"),
    angkatan: Yup.string()
      .matches(/^\d{4}$/, "Tahun angkatan harus 4 digit")
      .required("Tahun angkatan wajib diisi"),
    jenisBayar: Yup.string().required("Jenis pembayaran wajib dipilih"),
    caraBayar: Yup.string().required("Cara pembayaran wajib dipilih"),
    tanggalBayar: Yup.string().required("Tanggal pembayaran wajib diisi"),
    nominal: Yup.string().required("Nominal wajib diisi"),
    keteranganBayar: Yup.string().required("Keterangan bayar wajib dipilih"),
  });

  // Fetch student data by NIM with debounce
  useEffect(() => {
    if (!nimInput || nimInput.length < 8) {
      setDataMhs(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setFetchingStudent(true);
      try {
        const mhs = await fetchStudentByNim(nimInput);
        setDataMhs(mhs);
        if (mhs) {
          formikRef.current?.setFieldValue("nama", mhs.nama);
          formikRef.current?.setFieldValue("angkatan", mhs.angkatan);
          toast({
            title: "Data Ditemukan",
            description: `Mahasiswa: ${mhs.nama}`,
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          formikRef.current?.setFieldValue("nama", "");
          formikRef.current?.setFieldValue("angkatan", "");
          toast({
            title: "Mahasiswa Tidak Ditemukan",
            description: "NIM tidak terdaftar dalam sistem",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (err) {
        console.error(err);
        setDataMhs(null);
        formikRef.current?.setFieldValue("nama", "");
        formikRef.current?.setFieldValue("angkatan", "");
        toast({
          title: "Error",
          description: "Gagal mengambil data mahasiswa",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setFetchingStudent(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [nimInput, toast]);

  // Format currency
  const formatCurrency = useCallback((value) => {
    const raw = value.replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(raw));
  }, []);

  // Handle form submission
  const handleAccept = async (values, actions) => {
    setLoading(true);
    try {
      await submitKwitansi(values);

      toast({
        title: "Berhasil",
        description: "Kwitansi berhasil dibuat dan sedang diunduh...",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      // Generate PDF after success
      await generatePdf(values, user);

      // Reset and close
      actions.resetForm();
      handleClose(actions.resetForm);
      
      // Reload page to refresh table
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Terjadi kesalahan saat membuat kwitansi";

      toast({
        title: "Gagal",
        description: errorMsg,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = (resetForm) => {
    if (!loading) {
      resetForm?.();
      setDataMhs(null);
      setNimInput("");
      setTerbilang("");
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        nim: "",
        nama: "",
        angkatan: "",
        jenisBayar: "",
        caraBayar: "",
        tanggalBayar: getTodayDate(),
        nominal: "",
        keteranganBayar: "",
        terbilang: "",
      }}
      validationSchema={CreateSchema}
      onSubmit={handleAccept}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => {
        const isFormValid = formikProps.isValid && dataMhs;

        return (
          <Modal
            isOpen={isOpen}
            onClose={() => handleClose(formikProps.resetForm)}
            size="4xl"
            closeOnOverlayClick={!loading}
            isCentered
          >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" mx={4}>
              <ModalHeader
                fontSize="2xl"
                fontWeight="bold"
                color="blue.600"
                borderBottom="2px"
                borderColor="blue.100"
                pb={4}
              >
                <HStack>
                  <Text>Buat Kwitansi Pembayaran</Text>
                  <Tooltip label="Masukkan NIM untuk mengisi data otomatis">
                    <InfoIcon color="gray.400" boxSize={5} />
                  </Tooltip>
                </HStack>
              </ModalHeader>

              <ModalCloseButton
                isDisabled={loading}
                onClick={() => handleClose(formikProps.resetForm)}
                size="lg"
                top={4}
                right={4}
              />

              <ModalBody position="relative" py={6}>
                {/* Loading overlay for submission */}
                {loading && (
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    background="rgba(255, 255, 255, 0.95)"
                    justify="center"
                    align="center"
                    zIndex={999}
                    borderRadius="md"
                    flexDirection="column"
                    gap={4}
                  >
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <VStack spacing={2}>
                      <Text fontWeight="bold" fontSize="lg" color="blue.600">
                        Memproses Kwitansi
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Mohon tunggu sebentar...
                      </Text>
                    </VStack>
                  </Flex>
                )}

                <Form>
                  <VStack spacing={6} align="stretch">
                    {/* Student Information Section */}
                    <Box
                      bg="blue.50"
                      p={5}
                      borderRadius="lg"
                      borderLeft="4px"
                      borderColor="blue.500"
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="blue.700"
                        mb={4}
                      >
                        📋 Data Mahasiswa
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {/* NIM Input */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.nim && formikProps.touched.nim
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            NIM
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              {fetchingStudent ? (
                                <Spinner size="sm" color="blue.500" />
                              ) : dataMhs ? (
                                <CheckCircleIcon color="green.500" />
                              ) : null}
                            </InputLeftElement>
                            <Field name="nim">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Masukkan NIM"
                                  bg="white"
                                  borderWidth="2px"
                                  focusBorderColor="blue.500"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setNimInput(e.target.value);
                                  }}
                                  isDisabled={fetchingStudent}
                                />
                              )}
                            </Field>
                          </InputGroup>
                          <FormErrorMessage>
                            {formikProps.errors.nim}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Nama (Read-only) */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.nama && formikProps.touched.nama
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Nama Mahasiswa
                          </FormLabel>
                          <Field name="nama">
                            {({ field }) => (
                              <Input
                                {...field}
                                placeholder="Nama otomatis terisi"
                                bg="gray.100"
                                borderWidth="2px"
                                readOnly
                                fontWeight="medium"
                              />
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.nama}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Angkatan (Read-only) */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.angkatan &&
                            formikProps.touched.angkatan
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Tahun Angkatan
                          </FormLabel>
                          <Field name="angkatan">
                            {({ field }) => (
                              <Input
                                {...field}
                                placeholder="Angkatan otomatis terisi"
                                bg="gray.100"
                                borderWidth="2px"
                                readOnly
                                fontWeight="medium"
                              />
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.angkatan}
                          </FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>

                      {dataMhs && (
                        <Badge
                          colorScheme="green"
                          mt={3}
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          ✓ Data mahasiswa valid
                        </Badge>
                      )}
                    </Box>

                    <Divider />

                    {/* Payment Details Section */}
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="gray.700"
                        mb={4}
                      >
                        💰 Detail Pembayaran
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {/* Jenis Pembayaran */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.jenisBayar &&
                            formikProps.touched.jenisBayar
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Jenis Pembayaran
                          </FormLabel>
                          <Field name="jenisBayar">
                            {({ field }) => (
                              <Select
                                {...field}
                                placeholder="Pilih jenis pembayaran"
                                bg="white"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                              >
                                {jenisBayar.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.jenisBayar}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Cara Pembayaran */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.caraBayar &&
                            formikProps.touched.caraBayar
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Cara Pembayaran
                          </FormLabel>
                          <Field name="caraBayar">
                            {({ field }) => (
                              <Select
                                {...field}
                                placeholder="Pilih cara pembayaran"
                                bg="white"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                              >
                                {caraPembayaran.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.caraBayar}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Nominal */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.nominal &&
                            formikProps.touched.nominal
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Nominal Pembayaran
                          </FormLabel>
                          <Field name="nominal">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                placeholder="Rp 0"
                                bg="white"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                                fontSize="lg"
                                fontWeight="bold"
                                color="green.600"
                                onChange={(e) => {
                                  const formatted = formatCurrency(
                                    e.target.value
                                  );
                                  const raw = e.target.value.replace(/\D/g, "");
                                  form.setFieldValue("nominal", formatted);
                                  const terbilangText = raw
                                    ? toTerbilang(raw) + " Rupiah"
                                    : "";
                                  form.setFieldValue(
                                    "terbilang",
                                    terbilangText
                                  );
                                  setTerbilang(terbilangText);
                                }}
                              />
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.nominal}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Tanggal Pembayaran */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.tanggalBayar &&
                            formikProps.touched.tanggalBayar
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Tanggal Pembayaran
                          </FormLabel>
                          <Field name="tanggalBayar">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="date"
                                bg="white"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                              />
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.tanggalBayar}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Keterangan Bayar */}
                        <FormControl
                          isInvalid={
                            formikProps.errors.keteranganBayar &&
                            formikProps.touched.keteranganBayar
                          }
                        >
                          <FormLabel fontWeight="semibold" color="gray.700">
                            Status Pembayaran
                          </FormLabel>
                          <Field name="keteranganBayar">
                            {({ field }) => (
                              <Select
                                {...field}
                                placeholder="Pilih status"
                                bg="white"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                              >
                                {keteranganBayar.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.keteranganBayar}
                          </FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    {/* Terbilang Section */}
                    <FormControl>
                      <FormLabel fontWeight="semibold" color="gray.700">
                        Terbilang
                      </FormLabel>
                      <Field name="terbilang">
                        {({ field }) => (
                          <Textarea
                            {...field}
                            rows={3}
                            readOnly
                            placeholder="Terbilang akan muncul otomatis"
                            bg="yellow.50"
                            borderWidth="2px"
                            borderColor="yellow.300"
                            fontStyle="italic"
                            color="gray.700"
                            fontSize="md"
                            resize="none"
                          />
                        )}
                      </Field>
                    </FormControl>
                  </VStack>
                </Form>
              </ModalBody>

              {!loading && (
                <ModalFooter borderTop="1px" borderColor="gray.200" pt={4}>
                  <HStack spacing={3} width="100%" justify="flex-end">
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      onClick={() => handleClose(formikProps.resetForm)}
                      size="lg"
                      borderRadius="lg"
                      minW="120px"
                    >
                      Batal
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={formikProps.handleSubmit}
                      isDisabled={!isFormValid || loading}
                      size="lg"
                      borderRadius="lg"
                      minW="120px"
                    >
                      Buat Kwitansi
                    </Button>
                  </HStack>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>
        );
      }}
    </Formik>
  );
};