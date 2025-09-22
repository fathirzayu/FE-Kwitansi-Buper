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
  Select,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUser } from "../../api/listEndpoint";

export const ModalSettings = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Schema validasi
  const CreateSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password tidak sama")
      .required("Confirm password is required"),
    jabatan: Yup.string().required("Jabatan is required"),
  });

  const submitData = async (payload, actions) => {
    setLoading(true);
    try {
      await createUser(payload);

      toast({
        title: "User Created",
        description: "User berhasil dibuat.",
        status: "success",
        duration: 2000,
        isClosable: true,
        onCloseComplete: () => {
          actions.resetForm();
          setLoading(false);
          onClose();
        },
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Gagal membuat user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // handler close supaya reset form + close modal
  const handleClose = (resetForm) => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Formik
      initialValues={{
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        jabatan: "",
      }}
      validationSchema={CreateSchema}
      onSubmit={(values, actions) => {
        const payload = { ...values, fullname: values.fullname.toUpperCase() };
        submitData(payload, actions);
      }}
    >
      {(props) => (
        <Modal isOpen={isOpen} onClose={() => handleClose(props.resetForm)}>
          <ModalOverlay />
          <ModalContent maxW="60%" position="relative">
            <ModalHeader>Form Tambah User</ModalHeader>
            <ModalCloseButton disabled={loading} />

            {/* Loading overlay */}
            {loading && (
              <Flex
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bg="rgba(255,255,255,0.6)"
                zIndex="10"
                align="center"
                justify="center"
                borderRadius="md"
              >
                <Spinner size="xl" color="green.500" />
              </Flex>
            )}

            <Form>
              <ModalBody>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel textColor={"black"}>Nama Lengkap</FormLabel>
                    <Field
                      as={Input}
                      name="fullname"
                      placeholder="Nama Lengkap"
                      bgColor={"white"}
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
                      name="fullname"
                      style={{ color: "red" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel textColor={"black"}>Username</FormLabel>
                    <Field
                      as={Input}
                      name="username"
                      placeholder="Username"
                      bgColor={"white"}
                    />
                    <ErrorMessage
                      component="div"
                      name="username"
                      style={{ color: "red" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel textColor={"black"}>Email</FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Email"
                      bgColor={"white"}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      style={{ color: "red" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel textColor={"black"}>Jabatan</FormLabel>
                    <Field
                      as={Select}
                      name="jabatan"
                      bgColor={"white"}
                      placeholder="Pilih Jabatan"
                    >
                      <option value="WAKIL KETUA II BAGIAN KEUANGAN">
                        WAKIL KETUA II BAGIAN KEUANGAN
                      </option>
                      <option value="BENDAHARA">BENDAHARA</option>
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="jabatan"
                      style={{ color: "red" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel textColor={"black"}>Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="Password"
                      bgColor={"white"}
                    />
                    <ErrorMessage
                      component="div"
                      name="password"
                      style={{ color: "red" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel textColor={"black"}>Confirm Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      bgColor={"white"}
                    />
                    <ErrorMessage
                      component="div"
                      name="confirmPassword"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => handleClose(props.resetForm)}
                  disabled={loading}
                >
                  Close
                </Button>
                <Button colorScheme="green" type="submit" disabled={loading}>
                  Accept
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};
