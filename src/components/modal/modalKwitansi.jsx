import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toTerbilang } from "../../helper/helperTerbilang";
import { generatePdf } from "../../helper/generatePdf";
import { useSelector } from "react-redux";
import { fetchStudentByNim, submitKwitansi } from "../../api/listEndpoint";

export const ModalKwitansi = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.value);
  const toast = useToast();
  const [terbilang, setTerbilang] = useState("");
  const [nimInput, setNimInput] = useState("");
  const [dataMhs, setDataMhs] = useState(null);
  const [loading, setLoading] = useState(false);

  const formikRef = React.useRef();

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
  ];

  const keteranganBayar = ["CICILAN", "LUNAS"];
  const caraPembayaran = ["TRANSFER", "CASH", "QRIS"];

  useEffect(() => {
    if (!nimInput) return;
    const fetchDataMhs = async () => {
      try {
        const mhs = await fetchStudentByNim(nimInput);
        setDataMhs(mhs);
        if (mhs) {
          formikRef.current?.setFieldValue("nama", mhs.nama);
          formikRef.current?.setFieldValue("angkatan", mhs.angkatan);
        } else {
          formikRef.current?.setFieldValue("nama", "");
          formikRef.current?.setFieldValue("angkatan", "");
        }
      } catch (err) {
        console.error(err);
        setDataMhs(null);
        formikRef.current?.setFieldValue("nama", "");
        formikRef.current?.setFieldValue("angkatan", "");
      }
    };
    fetchDataMhs();
  }, [nimInput]);

  const CreateSchema = Yup.object().shape({
    nim: Yup.string().required("NIM is required"),
    nama: Yup.string().required("Nama Mahasiswa is required"),
    angkatan: Yup.string().required("Tahun Angkatan is required"),
    jenisBayar: Yup.string().required("Jenis Pembayaran is required"),
    caraBayar: Yup.string().required("Cara Pembayaran is required"),
    tanggalBayar: Yup.string().required("Tanggal Pembayaran is required"),
    nominal: Yup.string().required("Nominal is required"),
    keteranganBayar: Yup.string().required("Keterangan Bayar is required"),
  });

  const handleAccept = async (values, actions) => {
    setLoading(true);
    try {
      await submitKwitansi(values);

      toast({
        title: "Success",
        description: "Kwitansi berhasil dibuat.",
        status: "success",
        duration: 2000,
        isClosable: true,
        onCloseComplete: async () => {
          await generatePdf(values, user);
          setLoading(false);
          actions.resetForm();
          setDataMhs(null);
          setNimInput("");
          onClose();
          window.location.reload(false);
        },
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat kwitansi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
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
        tanggalBayar: "",
        nominal: "",
        keteranganBayar: "",
        terbilang: terbilang,
      }}
      validationSchema={CreateSchema}
      onSubmit={handleAccept}
    >
      {(props) => {
        const isAcceptDisabled = !props.values.nama || !props.values.angkatan;

        // ✅ Handle close supaya reset form + clear state
        const handleClose = (resetForm) => {
          resetForm();
          setDataMhs(null);
          setNimInput("");
          onClose();
        };

        return (
          <Modal isOpen={isOpen} onClose={() => handleClose(props.resetForm)}>
            <ModalOverlay />
            <ModalContent maxW="60%">
              <ModalHeader>Detail Kwitansi</ModalHeader>
              <ModalCloseButton onClick={() => handleClose(props.resetForm)} />
              <ModalBody>
                {loading ? (
                  <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color="green.500" />
                  </Flex>
                ) : (
                  <Box as={Form}>
                    <SimpleGrid columns={2} spacing={4}>
                      <FormControl>
                        <FormLabel textColor={"black"}>NIM</FormLabel>
                        <Field
                          as={Input}
                          name="nim"
                          placeholder="Masukkan NIM"
                          bgColor="white"
                          type="number"
                          onChange={(e) => {
                            props.setFieldValue("nim", e.target.value);
                            setNimInput(e.target.value);
                          }}
                        />
                        <ErrorMessage
                          component="div"
                          name="nim"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel>Nama Mahasiswa</FormLabel>
                        <Field
                          as={Input}
                          name="nama"
                          value={props.values.nama}
                          readOnly
                          bgColor="gray.100"
                          placeholder="Nama Mahasiswa"
                        />
                        <ErrorMessage
                          component="div"
                          name="nama"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel>Tahun Angkatan</FormLabel>
                        <Field
                          as={Input}
                          name="angkatan"
                          value={props.values.angkatan}
                          readOnly
                          bgColor="gray.100"
                          placeholder="Angkatan"
                        />
                        <ErrorMessage
                          component="div"
                          name="angkatan"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel textColor={"black"}>
                          Jenis Pembayaran
                        </FormLabel>
                        <Field as={Select} placeholder="Jenis Bayar" name="jenisBayar">
                          {jenisBayar?.map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="jenisBayar"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel textColor={"black"}>
                          Cara Pembayaran
                        </FormLabel>
                        <Field as={Select} placeholder="Cara Bayar" name="caraBayar">
                          {caraPembayaran?.map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="caraBayar"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel textColor={"black"}>Nominal</FormLabel>
                        <Field name="nominal">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              variant="flushed"
                              placeholder="Nominal"
                              bgColor={"white"}
                              onChange={(e) => {
                                let raw = e.target.value.replace(/\D/g, "");
                                let formatted = new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(raw ? parseInt(raw) : 0);
                                form.setFieldValue("nominal", formatted);
                                form.setFieldValue(
                                  "terbilang",
                                  raw ? toTerbilang(raw) + " Rupiah" : ""
                                );
                                setTerbilang(
                                  raw ? toTerbilang(raw) + " Rupiah" : ""
                                );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="nominal"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel textColor={"black"}>Tanggal Pembayaran</FormLabel>
                        <Field
                          as={Input}
                          type="date"
                          name="tanggalBayar"
                          bgColor="white"
                        />
                        <ErrorMessage
                          component="div"
                          name="tanggalBayar"
                          style={{ color: "red" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel textColor={"black"}>
                          Keterangan Bayar
                        </FormLabel>
                        <Field as={Select} placeholder="Pilih" name="keteranganBayar">
                          {keteranganBayar?.map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="keteranganBayar"
                          style={{ color: "red" }}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl mt={4}>
                      <FormLabel textColor={"black"}>
                        Terbilang Pembayaran
                      </FormLabel>
                      <Field name="terbilang">
                        {({ field }) => (
                          <Box>
                            <textarea
                              {...field}
                              readOnly
                              rows={3}
                              style={{
                                width: "100%",
                                border: "1px solid #E2E8F0",
                                borderRadius: "8px",
                                padding: "8px",
                                backgroundColor: "white",
                              }}
                            />
                          </Box>
                        )}
                      </Field>
                    </FormControl>
                  </Box>
                )}
              </ModalBody>

              {!loading && (
                <ModalFooter>
                  <Button
                    colorScheme="red"
                    mr={3}
                    onClick={() => handleClose(props.resetForm)}
                  >
                    Close
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={props.handleSubmit}
                    disabled={isAcceptDisabled}
                  >
                    Accept
                  </Button>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>
        );
      }}
    </Formik>
  );
};
