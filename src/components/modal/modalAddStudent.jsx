import React, { useState } from "react";
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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDropzone } from "react-dropzone";
import { addStudent, uploadStudentExcel } from "../../api/listEndpoint";

export const ModalAddStudent = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const CreateSchema = Yup.object().shape({
    nim: Yup.string()
      .matches(/^\d+$/, "NIM harus berupa angka")
      .required("NIM is required"),
    nama: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Nama hanya boleh huruf dan spasi")
      .required("Nama Mahasiswa is required"),
    angkatan: Yup.string()
      .matches(/^\d{4}$/, "Tahun Angkatan harus 4 digit angka")
      .required("Tahun Angkatan is required"),
  });

  // Submit manual
  const handleSubmit = async (data, actions) => {
    setLoading(true);
    try {
      await addStudent(data);
      toast({
        title: "Mahasiswa ditambahkan",
        description: "Data mahasiswa berhasil ditambahkan.",
        status: "success",
        duration: 2000,
        isClosable: true,
        onCloseComplete: () => {
          actions.resetForm();
          setLoading(false);
          handleClose(actions.resetForm);
        },
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal menambahkan mahasiswa.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
      console.log(err);
    }
  };

  // Upload Excel
  const handleUploadExcel = async () => {
    if (!file) {
      toast({
        title: "No file",
        description: "Silakan pilih file Excel terlebih dahulu.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await uploadStudentExcel(file);
      toast({
        title: "Upload sukses",
        description: "Data mahasiswa berhasil diimport dari Excel.",
        status: "success",
        duration: 2000,
        isClosable: true,
        onCloseComplete: () => {
          setFile(null);
          setLoading(false);
          onClose();
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message;
      toast({
        title: "Upload gagal",
        description: errorMsg,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
      console.log(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  // ✅ Centralized close handler supaya reset state
  const handleClose = (resetForm) => {
    resetForm?.();
    setFile(null);
    setLoading(false);
    onClose();
  };

  return (
    <Formik
      initialValues={{ nim: "", nama: "", angkatan: "" }}
      validationSchema={CreateSchema}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <Modal
          isOpen={isOpen}
          onClose={() => handleClose(props.resetForm)}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Mahasiswa</ModalHeader>
            <ModalCloseButton
              isDisabled={loading}
              onClick={() => handleClose(props.resetForm)}
            />
            <ModalBody position="relative">
              {/* Loading overlay */}
              {loading && (
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  background="rgba(255,255,255,0.6)"
                  justify="center"
                  align="center"
                  zIndex={10}
                >
                  <Spinner size="xl" color="green.500" />
                </Flex>
              )}

              <Tabs>
                <TabList>
                  <Tab>Manual</Tab>
                  <Tab>Upload Excel</Tab>
                </TabList>

                <TabPanels>
                  {/* TAB 1: Manual Input */}
                  <TabPanel>
                    <Form>
                      <SimpleGrid columns={2} spacing={4}>
                        <FormControl>
                          <FormLabel>Nama Mahasiswa</FormLabel>
                          <Field
                            as={Input}
                            name="nama"
                            placeholder="Nama Mahasiswa"
                            onKeyDown={(e) => {
                              if (
                                !/[a-zA-Z\s]/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Tab"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="nama"
                            style={{ color: "red" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>NIM</FormLabel>
                          <Field
                            as={Input}
                            name="nim"
                            type="number"
                            placeholder="NIM"
                          />
                          <ErrorMessage
                            component="div"
                            name="nim"
                            style={{ color: "red" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Tahun Angkatan</FormLabel>
                          <Field
                            as={Input}
                            name="angkatan"
                            type="number"
                            placeholder="Tahun Angkatan"
                          />
                          <ErrorMessage
                            component="div"
                            name="angkatan"
                            style={{ color: "red" }}
                          />
                        </FormControl>
                      </SimpleGrid>

                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          mr={3}
                          onClick={() => handleClose(props.resetForm)}
                          isDisabled={loading}
                        >
                          Close
                        </Button>
                        <Button
                          colorScheme="green"
                          type="submit"
                          isDisabled={loading}
                        >
                          Accept
                        </Button>
                      </ModalFooter>
                    </Form>
                  </TabPanel>

                  {/* TAB 2: Upload Excel */}
                  <TabPanel>
                    <Box
                      {...getRootProps()}
                      border="2px dashed"
                      borderColor={isDragActive ? "green.400" : "gray.300"}
                      borderRadius="md"
                      p={6}
                      textAlign="center"
                      cursor="pointer"
                    >
                      <input {...getInputProps()} />
                      {file ? (
                        <Text>{file.name}</Text>
                      ) : (
                        <Text>
                          {isDragActive
                            ? "Drop the file here ..."
                            : "Drag & drop Excel file here, or click to select"}
                        </Text>
                      )}
                    </Box>
                    <ModalFooter>
                      <Button
                        colorScheme="red"
                        mr={3}
                        onClick={() => handleClose(props.resetForm)}
                        isDisabled={loading}
                      >
                        Close
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={handleUploadExcel}
                        isDisabled={loading}
                      >
                        Upload
                      </Button>
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
