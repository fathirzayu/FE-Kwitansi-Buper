import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setValue } from "../redux/userSlice";
import { loginUser } from "../api/listEndpoint";

export const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const onLogin = async (data) => {
    try {
      const response = await loginUser(data);
      localStorage.setItem("token", response.data.token);
      dispatch(setValue(response.data.checkLogin));
      console.log(response);
      
      toast({
        title: "Login Success",
        description: "You have successfully logged in.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      toast({
        title: "Login Error",
        description: err.response?.data?.message || "An error occurred during login.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(err);
    }
  };

  const LoginSchema = Yup.object().shape({
    identifier: Yup.string()
      .required("Email or Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
  });

  return (
    <Formik
      initialValues={{
        identifier: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, actions) => {
        onLogin(values);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
            <Flex p={8} flex={1} align={"center"} justify={"center"}>
              <Stack spacing={4} w={"full"} maxW={"md"}>
                <Heading fontSize={"2xl"}>Sign in to your account</Heading>

                {/* Email / Username */}
                <FormControl id="identifier">
                  <FormLabel>Email or Username</FormLabel>
                  <Field
                    as={Input}
                    type="text"
                    name="identifier"
                    placeholder="Enter your email or username"
                  />
                  <Text fontSize="sm" color="red.500">
                    <ErrorMessage name="identifier" />
                  </Text>
                </FormControl>

                {/* Password */}
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                  <Text fontSize="sm" color="red.500">
                    <ErrorMessage name="password" />
                  </Text>
                </FormControl>

                <Stack spacing={6}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Stack>
                  <Button
                    type="submit"
                    colorScheme={"blue"}
                    variant={"solid"}
                    isLoading={isSubmitting}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Flex>
            <Flex
              flex={1}
              align={{ base: "center", md: "center" }}
              justify={{ base: "center", md: "flex-start" }}
            >
              <Image
                alt="Login Image"
                objectFit="contain"
                src="/buper.png"
                w={{ base: "200px", md: "500px" }}
              />
            </Flex>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
