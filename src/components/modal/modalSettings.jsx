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
  Select,
  Spinner,
  Flex,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Box,
  HStack,
  FormHelperText,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
  Progress,
} from "@chakra-ui/react";
import {
  ViewIcon,
  ViewOffIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUser } from "../../api/listEndpoint";

// Validation schema
const CreateSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .matches(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi")
    .required("Nama lengkap wajib diisi"),
  username: Yup.string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan underscore"
    )
    .required("Username wajib diisi"),
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter")
    .matches(/(?=.*[a-z])/, "Password harus mengandung minimal 1 huruf kecil")
    .matches(/(?=.*[A-Z])/, "Password harus mengandung minimal 1 huruf besar")
    .matches(/(?=.*\d)/, "Password harus mengandung minimal 1 angka")
    .matches(
      /(?=.*[@$!%*?&])/,
      "Password harus mengandung minimal 1 karakter spesial (@$!%*?&)"
    )
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
  jabatan: Yup.string().required("Jabatan wajib dipilih"),
});

// Position options
const POSITION_OPTIONS = [
  { value: "WAKIL KETUA II BAGIAN KEUANGAN", label: "Wakil Ketua II Bagian Keuangan" },
  { value: "BENDAHARA", label: "Bendahara" },
  { value: "STAFF KEUANGAN", label: "Staff Keuangan" },
  { value: "ADMIN", label: "Admin" },
];

// Password strength calculator
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (!password) return 0;

  // Length
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;

  // Character types
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 20;
  if (/[@$!%*?&]/.test(password)) strength += 20;

  return Math.min(strength, 100);
};

// Get strength color and label
const getStrengthInfo = (strength) => {
  if (strength < 40) return { color: "red", label: "Lemah" };
  if (strength < 70) return { color: "yellow", label: "Sedang" };
  return { color: "green", label: "Kuat" };
};

// Custom error message component
const FormError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => (
      <Text color="red.500" fontSize="sm" mt={1} fontWeight="medium">
        {msg}
      </Text>
    )}
  </ErrorMessage>
);

export const ModalSettings = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const submitData = async (payload, actions) => {
    setLoading(true);
    try {
      await createUser(payload);

      toast({
        title: "Berhasil",
        description: `User ${payload.fullname} berhasil dibuat`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      actions.resetForm();
      setPasswordStrength(0);
      handleClose(actions.resetForm);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal membuat user. Silakan coba lagi.";

      toast({
        title: "Gagal Membuat User",
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

  const handleClose = useCallback(
    (resetForm) => {
      if (!loading) {
        resetForm?.();
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordStrength(0);
        onClose();
      }
    },
    [loading, onClose]
  );

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
        const payload = {
          fullname: values.fullname.trim().toUpperCase(),
          username: values.username.trim().toLowerCase(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          jabatan: values.jabatan,
        };
        submitData(payload, actions);
      }}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <Modal
          isOpen={isOpen}
          onClose={() => handleClose(formikProps.resetForm)}
          closeOnOverlayClick={!loading}
          closeOnEsc={!loading}
          size="4xl"
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
                <Text>Tambah User Baru</Text>
                <Badge colorScheme="blue" fontSize="sm">
                  Admin Panel
                </Badge>
              </HStack>
            </ModalHeader>

            <ModalCloseButton
              isDisabled={loading}
              onClick={() => handleClose(formikProps.resetForm)}
              size="lg"
              top={4}
              right={4}
            />

            {/* Loading overlay */}
            {loading && (
              <Flex
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(4px)"
                zIndex="999"
                align="center"
                justify="center"
                borderRadius="xl"
              >
                <VStack spacing={4}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <VStack spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color="blue.600">
                      Membuat User
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Mohon tunggu sebentar...
                    </Text>
                  </VStack>
                </VStack>
              </Flex>
            )}

            <Form>
              <ModalBody py={6}>
                <VStack spacing={6} align="stretch">
                  {/* Personal Information Section */}
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize="md"
                      color="gray.700"
                      mb={4}
                    >
                      👤 Informasi Personal
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {/* Full Name */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.fullname &&
                          formikProps.touched.fullname
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Nama Lengkap
                        </FormLabel>
                        <Field name="fullname">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Masukkan nama lengkap"
                              size="lg"
                              borderWidth="2px"
                              focusBorderColor="blue.500"
                              isDisabled={loading}
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
                        <FormError name="fullname" />
                      </FormControl>

                      {/* Username */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.username &&
                          formikProps.touched.username
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Username
                        </FormLabel>
                        <Field name="username">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Masukkan username"
                              size="lg"
                              borderWidth="2px"
                              focusBorderColor="blue.500"
                              isDisabled={loading}
                              onChange={(e) => {
                                const value = e.target.value.toLowerCase();
                                formikProps.setFieldValue("username", value);
                              }}
                            />
                          )}
                        </Field>
                        <FormHelperText fontSize="xs" color="gray.600">
                          Huruf kecil, angka, dan underscore saja
                        </FormHelperText>
                        <FormError name="username" />
                      </FormControl>

                      {/* Email */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.email && formikProps.touched.email
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Email
                        </FormLabel>
                        <Field name="email">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="email"
                              placeholder="contoh@email.com"
                              size="lg"
                              borderWidth="2px"
                              focusBorderColor="blue.500"
                              isDisabled={loading}
                              onChange={(e) => {
                                const value = e.target.value.toLowerCase();
                                formikProps.setFieldValue("email", value);
                              }}
                            />
                          )}
                        </Field>
                        <FormError name="email" />
                      </FormControl>

                      {/* Position */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.jabatan &&
                          formikProps.touched.jabatan
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Jabatan
                        </FormLabel>
                        <Field name="jabatan">
                          {({ field }) => (
                            <Select
                              {...field}
                              placeholder="Pilih jabatan"
                              size="lg"
                              borderWidth="2px"
                              focusBorderColor="blue.500"
                              isDisabled={loading}
                            >
                              {POSITION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <FormError name="jabatan" />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Security Section */}
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize="md"
                      color="gray.700"
                      mb={4}
                    >
                      🔒 Keamanan
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {/* Password */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.password &&
                          formikProps.touched.password
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Password
                        </FormLabel>
                        <InputGroup size="lg">
                          <Field name="password">
                            {({ field }) => (
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan password"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                                isDisabled={loading}
                                pr="4.5rem"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setPasswordStrength(
                                    calculatePasswordStrength(e.target.value)
                                  );
                                }}
                              />
                            )}
                          </Field>
                          <InputRightElement>
                            <IconButton
                              icon={
                                showPassword ? <ViewOffIcon /> : <ViewIcon />
                              }
                              onClick={togglePasswordVisibility}
                              variant="ghost"
                              size="sm"
                              aria-label={
                                showPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                              isDisabled={loading}
                              tabIndex={-1}
                            />
                          </InputRightElement>
                        </InputGroup>

                        {/* Password Strength Indicator */}
                        {formikProps.values.password && (
                          <Box mt={2}>
                            <HStack justify="space-between" mb={1}>
                              <Text fontSize="xs" color="gray.600">
                                Kekuatan Password
                              </Text>
                              <Badge
                                colorScheme={
                                  getStrengthInfo(passwordStrength).color
                                }
                                fontSize="xs"
                              >
                                {getStrengthInfo(passwordStrength).label}
                              </Badge>
                            </HStack>
                            <Progress
                              value={passwordStrength}
                              size="sm"
                              colorScheme={
                                getStrengthInfo(passwordStrength).color
                              }
                              borderRadius="full"
                            />
                          </Box>
                        )}

                        <FormError name="password" />
                      </FormControl>

                      {/* Confirm Password */}
                      <FormControl
                        isRequired
                        isInvalid={
                          formikProps.errors.confirmPassword &&
                          formikProps.touched.confirmPassword
                        }
                      >
                        <FormLabel fontWeight="semibold" color="gray.700">
                          Konfirmasi Password
                        </FormLabel>
                        <InputGroup size="lg">
                          <Field name="confirmPassword">
                            {({ field }) => (
                              <Input
                                {...field}
                                type={
                                  showConfirmPassword ? "text" : "password"
                                }
                                placeholder="Masukkan ulang password"
                                borderWidth="2px"
                                focusBorderColor="blue.500"
                                isDisabled={loading}
                                pr="4.5rem"
                              />
                            )}
                          </Field>
                          <InputRightElement>
                            <IconButton
                              icon={
                                showConfirmPassword ? (
                                  <ViewOffIcon />
                                ) : (
                                  <ViewIcon />
                                )
                              }
                              onClick={toggleConfirmPasswordVisibility}
                              variant="ghost"
                              size="sm"
                              aria-label={
                                showConfirmPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                              isDisabled={loading}
                              tabIndex={-1}
                            />
                          </InputRightElement>
                        </InputGroup>
                        {formikProps.values.confirmPassword &&
                          formikProps.values.password ===
                            formikProps.values.confirmPassword && (
                            <HStack mt={2}>
                              <CheckCircleIcon color="green.500" boxSize={4} />
                              <Text fontSize="sm" color="green.600">
                                Password cocok
                              </Text>
                            </HStack>
                          )}
                        <FormError name="confirmPassword" />
                      </FormControl>
                    </SimpleGrid>

                    {/* Password Requirements */}
                    <Box
                      mt={4}
                      p={4}
                      bg="blue.50"
                      borderRadius="lg"
                      borderLeft="4px"
                      borderColor="blue.500"
                    >
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        color="blue.700"
                        mb={2}
                      >
                        📝 Persyaratan Password:
                      </Text>
                      <List spacing={1} fontSize="sm">
                        <ListItem color="gray.700">
                          <ListIcon
                            as={
                              formikProps.values.password?.length >= 8
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                            color={
                              formikProps.values.password?.length >= 8
                                ? "green.500"
                                : "gray.400"
                            }
                          />
                          Minimal 8 karakter
                        </ListItem>
                        <ListItem color="gray.700">
                          <ListIcon
                            as={
                              /[a-z]/.test(formikProps.values.password)
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                            color={
                              /[a-z]/.test(formikProps.values.password)
                                ? "green.500"
                                : "gray.400"
                            }
                          />
                          Minimal 1 huruf kecil
                        </ListItem>
                        <ListItem color="gray.700">
                          <ListIcon
                            as={
                              /[A-Z]/.test(formikProps.values.password)
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                            color={
                              /[A-Z]/.test(formikProps.values.password)
                                ? "green.500"
                                : "gray.400"
                            }
                          />
                          Minimal 1 huruf besar
                        </ListItem>
                        <ListItem color="gray.700">
                          <ListIcon
                            as={
                              /\d/.test(formikProps.values.password)
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                            color={
                              /\d/.test(formikProps.values.password)
                                ? "green.500"
                                : "gray.400"
                            }
                          />
                          Minimal 1 angka
                        </ListItem>
                        <ListItem color="gray.700">
                          <ListIcon
                            as={
                              /[@$!%*?&]/.test(formikProps.values.password)
                                ? CheckCircleIcon
                                : WarningIcon
                            }
                            color={
                              /[@$!%*?&]/.test(formikProps.values.password)
                                ? "green.500"
                                : "gray.400"
                            }
                          />
                          Minimal 1 karakter spesial (@$!%*?&)
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                </VStack>
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
                      type="submit"
                      isDisabled={!formikProps.isValid || loading}
                      size="lg"
                      borderRadius="lg"
                      minW="120px"
                    >
                      Buat User
                    </Button>
                  </HStack>
                </ModalFooter>
              )}
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};