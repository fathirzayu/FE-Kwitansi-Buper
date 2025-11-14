import React, { useState, useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  Icon,
  FormErrorMessage,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { AttachmentIcon, CheckCircleIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useDropzone } from "react-dropzone";
import { addStudent, uploadStudentExcel } from "../../api/listEndpoint";

export const ModalAddStudent = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // Validation schema
  const CreateSchema = Yup.object().shape({
    nim: Yup.string()
      .matches(/^\d+$/, "NIM harus berupa angka")
      .min(8, "NIM minimal 8 digit")
      .required("NIM wajib diisi"),
    nama: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Nama hanya boleh huruf dan spasi")
      .min(3, "Nama minimal 3 karakter")
      .required("Nama mahasiswa wajib diisi"),
    angkatan: Yup.string()
      .matches(/^\d{4}$/, "Tahun angkatan harus 4 digit")
      .test("valid-year", "Tahun tidak valid", (value) => {
        if (!value) return false;
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 1;
      })
      .required("Tahun angkatan wajib diisi"),
  });

  // Handle manual form submission
  const handleSubmit = async (data, actions) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        nama: data.nama.toUpperCase().trim(),
      };
      await addStudent(payload);
      
      toast({
        title: "Berhasil",
        description: `Mahasiswa ${data.nama} berhasil ditambahkan`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      actions.resetForm();
      handleClose(actions.resetForm);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Gagal menambahkan mahasiswa";

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

  // Handle Excel upload
  const handleUploadExcel = async () => {
    if (!file) {
      toast({
        title: "File Tidak Dipilih",
        description: "Silakan pilih file Excel terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      await uploadStudentExcel(file);
      
      toast({
        title: "Upload Berhasil",
        description: "Data mahasiswa berhasil diimport dari Excel",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setFile(null);
      handleClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Upload gagal, pastikan format Excel sesuai";

      toast({
        title: "Upload Gagal",
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

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast({
        title: "File Dipilih",
        description: acceptedFiles[0].name,
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDrop,
    onDropRejected: () => {
      toast({
        title: "File Tidak Valid",
        description: "Hanya file Excel (.xls, .xlsx) yang diperbolehkan",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  // Centralized close handler
  const handleClose = (resetForm) => {
    if (!loading) {
      resetForm?.();
      setFile(null);
      setTabIndex(0);
      onClose();
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Formik
      initialValues={{ nim: "", nama: "", angkatan: "" }}
      validationSchema={CreateSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <Modal
          isOpen={isOpen}
          onClose={() => handleClose(formikProps.resetForm)}
          size="2xl"
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
              Tambah Mahasiswa Baru
            </ModalHeader>
            <ModalCloseButton
              isDisabled={loading}
              onClick={() => handleClose(formikProps.resetForm)}
              size="lg"
              top={4}
              right={4}
            />

            <ModalBody position="relative" py={6}>
              {/* Loading overlay */}
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
                  <Text fontWeight="semibold" color="blue.600">
                    Memproses data...
                  </Text>
                </Flex>
              )}

              <Tabs
                index={tabIndex}
                onChange={setTabIndex}
                variant="enclosed"
                colorScheme="blue"
                isLazy
              >
                <TabList borderBottom="2px" borderColor="gray.200">
                  <Tab
                    _selected={{
                      color: "blue.600",
                      borderColor: "blue.500",
                      borderBottomColor: "white",
                      fontWeight: "bold",
                    }}
                    fontSize="md"
                  >
                    📝 Input Manual
                  </Tab>
                  <Tab
                    _selected={{
                      color: "blue.600",
                      borderColor: "blue.500",
                      borderBottomColor: "white",
                      fontWeight: "bold",
                    }}
                    fontSize="md"
                  >
                    📊 Upload Excel
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* TAB 1: Manual Input */}
                  <TabPanel px={0} pt={6}>
                    <Form>
                      <VStack spacing={5} align="stretch">
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
                                placeholder="Masukkan nama lengkap"
                                size="lg"
                                borderRadius="lg"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                                onKeyDown={(e) => {
                                  if (
                                    !/[a-zA-Z\s]/.test(e.key) &&
                                    e.key !== "Backspace" &&
                                    e.key !== "Tab" &&
                                    e.key !== "Delete" &&
                                    e.key !== "ArrowLeft" &&
                                    e.key !== "ArrowRight"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <FormErrorMessage>
                            {formikProps.errors.nama}
                          </FormErrorMessage>
                        </FormControl>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                          <FormControl
                            isInvalid={
                              formikProps.errors.nim && formikProps.touched.nim
                            }
                          >
                            <FormLabel fontWeight="semibold" color="gray.700">
                              NIM
                            </FormLabel>
                            <Field name="nim">
                              {({ field }) => (
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Nomor Induk Mahasiswa"
                                  size="lg"
                                  borderRadius="lg"
                                  borderWidth="2px"
                                  focusBorderColor="blue.500"
                                  maxLength={15}
                                />
                              )}
                            </Field>
                            <FormErrorMessage>
                              {formikProps.errors.nim}
                            </FormErrorMessage>
                          </FormControl>

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
                                  type="text"
                                  placeholder="contoh: 2024"
                                  size="lg"
                                  borderRadius="lg"
                                  borderWidth="2px"
                                  focusBorderColor="blue.500"
                                  maxLength={4}
                                />
                              )}
                            </Field>
                            <FormErrorMessage>
                              {formikProps.errors.angkatan}
                            </FormErrorMessage>
                          </FormControl>
                        </SimpleGrid>
                      </VStack>

                      <ModalFooter px={0} pt={8} pb={0}>
                        <HStack spacing={3} width="100%" justify="flex-end">
                          <Button
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => handleClose(formikProps.resetForm)}
                            isDisabled={loading}
                            size="lg"
                            borderRadius="lg"
                            minW="120px"
                          >
                            Batal
                          </Button>
                          <Button
                            colorScheme="blue"
                            type="submit"
                            isDisabled={loading || !formikProps.isValid}
                            isLoading={loading}
                            size="lg"
                            borderRadius="lg"
                            minW="120px"
                          >
                            Simpan
                          </Button>
                        </HStack>
                      </ModalFooter>
                    </Form>
                  </TabPanel>

                  {/* TAB 2: Upload Excel */}
                  <TabPanel px={0} pt={6}>
                    <VStack spacing={6} align="stretch">
                      <Box
                        {...getRootProps()}
                        border="3px dashed"
                        borderColor={
                          isDragActive
                            ? "blue.400"
                            : isDragReject
                            ? "red.400"
                            : file
                            ? "green.400"
                            : "gray.300"
                        }
                        borderRadius="xl"
                        p={8}
                        textAlign="center"
                        cursor="pointer"
                        bg={
                          isDragActive
                            ? "blue.50"
                            : isDragReject
                            ? "red.50"
                            : file
                            ? "green.50"
                            : "gray.50"
                        }
                        transition="all 0.3s"
                        _hover={{
                          borderColor: "blue.400",
                          bg: "blue.50",
                        }}
                      >
                        <input {...getInputProps()} />
                        <VStack spacing={4}>
                          {file ? (
                            <>
                              <Icon
                                as={CheckCircleIcon}
                                boxSize={12}
                                color="green.500"
                              />
                              <VStack spacing={2}>
                                <Text fontWeight="bold" fontSize="lg">
                                  File Dipilih
                                </Text>
                                <Badge
                                  colorScheme="green"
                                  fontSize="md"
                                  px={4}
                                  py={2}
                                  borderRadius="full"
                                >
                                  {file.name}
                                </Badge>
                                <Text fontSize="sm" color="gray.600">
                                  {(file.size / 1024).toFixed(2)} KB
                                </Text>
                              </VStack>
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile();
                                }}
                              >
                                Hapus File
                              </Button>
                            </>
                          ) : (
                            <>
                              <Icon
                                as={AttachmentIcon}
                                boxSize={12}
                                color={isDragActive ? "blue.500" : "gray.400"}
                              />
                              <VStack spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">
                                  {isDragActive
                                    ? "Lepaskan file di sini"
                                    : "Drag & drop file Excel"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  atau klik untuk memilih file
                                </Text>
                                <Badge mt={2} colorScheme="blue">
                                  Format: .xls, .xlsx
                                </Badge>
                              </VStack>
                            </>
                          )}
                        </VStack>
                      </Box>

                      {/* Info Box */}
                      <Box
                        bg="blue.50"
                        p={4}
                        borderRadius="lg"
                        borderLeft="4px"
                        borderColor="blue.500"
                      >
                        <Text fontWeight="semibold" color="blue.700" mb={2}>
                          📋 Format Excel yang Benar:
                        </Text>
                        <VStack align="start" spacing={1} fontSize="sm" color="gray.700">
                          <Text>• Kolom 1: NIM (angka)</Text>
                          <Text>• Kolom 2: Nama (huruf)</Text>
                          <Text>• Kolom 3: Angkatan (4 digit tahun)</Text>
                        </VStack>
                      </Box>
                    </VStack>

                    <ModalFooter px={0} pt={8} pb={0}>
                      <HStack spacing={3} width="100%" justify="flex-end">
                        <Button
                          variant="outline"
                          colorScheme="gray"
                          onClick={() => handleClose(formikProps.resetForm)}
                          isDisabled={loading}
                          size="lg"
                          borderRadius="lg"
                          minW="120px"
                        >
                          Batal
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={handleUploadExcel}
                          isDisabled={loading || !file}
                          isLoading={loading}
                          size="lg"
                          borderRadius="lg"
                          minW="120px"
                          leftIcon={<AttachmentIcon />}
                        >
                          Upload
                        </Button>
                      </HStack>
                    </ModalFooter>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};