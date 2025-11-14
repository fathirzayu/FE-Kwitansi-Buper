import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  Box,
  Link,
  Container,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, LockIcon, AtSignIcon } from "@chakra-ui/icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useState, useCallback, useEffect } from "react";
import { setValue } from "../redux/userSlice";
import { loginUser } from "../api/listEndpoint";

// Validation schema
const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("This field is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Custom error component
const FormError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => (
      <Text fontSize="xs" color="red.400" mt={1} fontWeight="medium">
        {msg}
      </Text>
    )}
  </ErrorMessage>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedIdentifier = localStorage.getItem("rememberedIdentifier");
    if (rememberedIdentifier) {
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onLogin = async (data, actions) => {
    try {
      if (rememberMe) {
        localStorage.setItem("rememberedIdentifier", data.identifier);
      } else {
        localStorage.removeItem("rememberedIdentifier");
      }

      const response = await loginUser(data);
      
      if (!response.data?.token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", response.data.token);
      dispatch(setValue(response.data.checkLogin));

      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${response.data.checkLogin?.fullname || "User"}`,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to sign in. Please check your credentials.";
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      console.error("Login error:", err);
      actions.setSubmitting(false);
    }
  };

  const getInitialIdentifier = () => {
    return localStorage.getItem("rememberedIdentifier") || "";
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(255, 215, 0, 0.15)"
        filter="blur(100px)"
        animation="float 8s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="rgba(30, 144, 255, 0.2)"
        filter="blur(100px)"
        animation="float 10s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        top="30%"
        left="20%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(255, 215, 0, 0.1)"
        filter="blur(80px)"
        animation="pulse 6s ease-in-out infinite"
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -20px) rotate(5deg); }
            50% { transform: translate(-10px, -30px) rotate(-5deg); }
            75% { transform: translate(15px, -10px) rotate(3deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}
      </style>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Formik
          initialValues={{
            identifier: getInitialIdentifier(),
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={(values, actions) => {
            onLogin(values, actions);
          }}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Flex
                direction={{ base: "column", lg: "row" }}
                bg="rgba(255, 255, 255, 0.98)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                border="1px solid rgba(255, 255, 255, 0.3)"
                minH={{ base: "auto", lg: "650px" }}
              >
                {/* Left Side - Branding */}
                <Flex
                  flex={1}
                  bg="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
                  p={{ base: 8, md: 12 }}
                  align="center"
                  justify="center"
                  position="relative"
                  display={{ base: "none", lg: "flex" }}
                  overflow="hidden"
                >
                  {/* Decorative yellow accent circles */}
                  <Box
                    position="absolute"
                    top="-80px"
                    right="-80px"
                    w="250px"
                    h="250px"
                    borderRadius="full"
                    bg="rgba(255, 215, 0, 0.15)"
                    filter="blur(40px)"
                  />
                  <Box
                    position="absolute"
                    bottom="-60px"
                    left="-60px"
                    w="200px"
                    h="200px"
                    borderRadius="full"
                    bg="rgba(255, 215, 0, 0.2)"
                    filter="blur(40px)"
                  />

                  <VStack spacing={8} color="white" textAlign="center" zIndex={1}>
                    <Box
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(10px)"
                      p={6}
                      borderRadius="2xl"
                      border="2px solid rgba(255, 215, 0, 0.3)"
                      boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
                    >
                      <Image
                        src="/buper.png"
                        alt="Logo"
                        maxW="280px"
                        w="100%"
                        filter="drop-shadow(0 10px 30px rgba(0,0,0,0.3))"
                        fallbackSrc="https://via.placeholder.com/280x280?text=Logo"
                      />
                    </Box>
                    
                    

                    
                  </VStack>

                  {/* Decorative geometric elements */}
                  <Box
                    position="absolute"
                    top="40px"
                    right="40px"
                    w="120px"
                    h="120px"
                    borderRadius="xl"
                    border="3px solid rgba(255, 215, 0, 0.3)"
                    transform="rotate(45deg)"
                  />
                  <Box
                    position="absolute"
                    bottom="50px"
                    left="50px"
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    border="3px solid rgba(255, 215, 0, 0.25)"
                  />
                </Flex>

                {/* Right Side - Login Form */}
                <Flex flex={1} p={{ base: 8, md: 12 }} align="center" justify="center">
                  <VStack spacing={8} w="full" maxW="420px">
                    {/* Header */}
                    <VStack spacing={3} w="full" textAlign="center">
                      <Heading 
                        size="2xl" 
                        color="blue.900"
                        position="relative"
                        _after={{
                          content: '""',
                          position: "absolute",
                          bottom: "-8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60px",
                          height: "4px",
                          borderRadius: "full",
                        }}
                      >
                        SIGN IN
                      </Heading>
                      <Text color="gray.600" fontSize="md" pt={2}>
                        Enter your credentials to continue
                      </Text>
                    </VStack>

                    {/* Form Fields */}
                    <VStack spacing={5} w="full">
                      {/* Email/Username Field */}
                      <FormControl
                        isRequired
                        isInvalid={errors.identifier && touched.identifier}
                      >
                        <FormLabel color="blue.900" fontWeight="bold" fontSize="sm">
                          Email or Username
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputRightElement pointerEvents="none" color="gray.400">
                            <Icon as={AtSignIcon} />
                          </InputRightElement>
                          <Field
                            as={Input}
                            name="identifier"
                            type="text"
                            placeholder="john@example.com"
                            autoComplete="username"
                            disabled={isSubmitting}
                            borderColor="gray.300"
                            bg="gray.50"
                            _hover={{ 
                              borderColor: "blue.400",
                              bg: "white"
                            }}
                            _focus={{
                              borderColor: "blue.600",
                              bg: "white",
                              boxShadow: "0 0 0 3px rgba(30, 60, 114, 0.1)",
                            }}
                            pr="2.5rem"
                          />
                        </InputGroup>
                        <FormError name="identifier" />
                      </FormControl>

                      {/* Password Field */}
                      <FormControl
                        isRequired
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel color="blue.900" fontWeight="bold" fontSize="sm">
                          Password
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={togglePasswordVisibility}
                              disabled={isSubmitting}
                              tabIndex={-1}
                              color="gray.500"
                              _hover={{ 
                                color: "blue.600",
                                bg: "blue.50"
                              }}
                            />
                          </InputRightElement>
                          <Field
                            as={Input}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            borderColor="gray.300"
                            bg="gray.50"
                            _hover={{ 
                              borderColor: "blue.400",
                              bg: "white"
                            }}
                            _focus={{
                              borderColor: "blue.600",
                              bg: "white",
                              boxShadow: "0 0 0 3px rgba(30, 60, 114, 0.1)",
                            }}
                            pr="2.5rem"
                          />
                        </InputGroup>
                        <FormError name="password" />
                      </FormControl>

                      {/* Remember Me & Forgot Password */}
                      <Flex w="full" justify="space-between" align="center">
                        <Checkbox
                          isChecked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={isSubmitting}
                          colorScheme="blue"
                          size="md"
                        >
                          <Text fontSize="sm" color="gray.700" fontWeight="medium">
                            Remember me
                          </Text>
                        </Checkbox>
                        <Link
                          fontSize="sm"
                          color="blue.600"
                          fontWeight="bold"
                          _hover={{ 
                            color: "blue.800",
                            textDecoration: "underline"
                          }}
                        >
                          Forgot password?
                        </Link>
                      </Flex>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        h="56px"
                        bg="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
                        color="white"
                        fontWeight="bold"
                        fontSize="md"
                        isLoading={isSubmitting}
                        loadingText="Signing in..."
                        disabled={isSubmitting}
                        position="relative"
                        overflow="hidden"
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          bg: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)",
                          transition: "left 0.6s",
                        }}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(30, 60, 114, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)",
                          _before: {
                            left: "100%",
                          }
                        }}
                        _active={{
                          transform: "translateY(0)",
                        }}
                        transition="all 0.3s"
                        leftIcon={<LockIcon />}
                        border="2px solid rgba(255, 215, 0, 0.3)"
                      >
                        Sign In Now
                      </Button>
                    </VStack>

                    Divider
                    {/* <HStack w="full" py={2}>
                      <Divider borderColor="gray.300" />
                      <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" fontWeight="bold">
                        OR
                      </Text>
                      <Divider borderColor="gray.300" />
                    </HStack> */}

                    {/* Sign Up Link */}
                    {/* <Box
                      w="full"
                      p={4}
                      bg="linear-gradient(135deg, rgba(30, 60, 114, 0.05), rgba(255, 215, 0, 0.05))"
                      borderRadius="xl"
                      border="2px solid rgba(30, 60, 114, 0.1)"
                      textAlign="center"
                    >
                    </Box> */}
                  </VStack>
                </Flex>
              </Flex>
            </Form>
          )}
        </Formik>
      </Container>
    </Flex>
  );
};