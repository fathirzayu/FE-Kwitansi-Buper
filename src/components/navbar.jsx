import React from "react";
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tag,
  useToast,
  useMediaQuery,
  Image,
  HStack,
  VStack,
  Divider,
  Container,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAvatarUrl } from "../api/listEndpoint";

export const Navbar = () => {
  const dataRedux = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLargerThanMd] = useMediaQuery("(min-width: 48em)");
  const [isLargerThanSm] = useMediaQuery("(min-width: 30em)");

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa kembali!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Box>
      {/* Navbar */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        width="100%"
        zIndex={1000}
        bg="yellow.400"
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <Flex
            align="center"
            justify="space-between"
            py={{ base: 3, md: 4 }}
            gap={4}
          >
            {/* Logo and Brand */}
            <HStack
              spacing={3}
              cursor="pointer"
              onClick={handleLogoClick}
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
              flex={{ base: "1", md: "none" }}
            >
              <Image
                src="/buper.png"
                alt="Logo STIE Budi Pertiwi"
                boxSize={{ base: "50px", md: "60px" }}
                borderRadius="full"
                border="3px solid"
                borderColor="white"
                bg="white"
                objectFit="cover"
              />
              {isLargerThanMd && (
                <Text
                  fontWeight="extrabold"
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  color="blue.600"
                  letterSpacing="tight"
                  noOfLines={1}
                >
                  STIE BUDI PERTIWI
                </Text>
              )}
            </HStack>

            {/* User Menu */}
            <Menu placement="bottom-end">
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Box}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)" }}
                    _active={{ transform: "translateY(0)" }}
                  >
                    <Tag
                      size={isLargerThanSm ? "lg" : "md"}
                      borderRadius="full"
                      bg="white"
                      color="gray.700"
                      py={2}
                      px={3}
                      boxShadow="sm"
                      _hover={{ boxShadow: "md", bg: "gray.50" }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={3}>
                        <Avatar
                          src={getAvatarUrl(dataRedux.imgProfile)}
                          size={isLargerThanSm ? "sm" : "xs"}
                          name={dataRedux.fullname}
                          bg="blue.500"
                        />
                        
                        {isLargerThanSm && (
                          <VStack spacing={0} align="start" minW="120px">
                            <Text
                              fontWeight="bold"
                              fontSize="sm"
                              textTransform="capitalize"
                              noOfLines={1}
                            >
                              {dataRedux.fullname}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              textTransform="uppercase"
                              noOfLines={1}
                            >
                              {dataRedux.jabatan}
                            </Text>
                          </VStack>
                        )}
                        
                        <ChevronDownIcon
                          boxSize={5}
                          transition="transform 0.2s"
                          transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
                        />
                      </HStack>
                    </Tag>
                  </MenuButton>

                  <MenuList
                    boxShadow="lg"
                    borderRadius="lg"
                    py={2}
                    minW="200px"
                  >
                    {/* User Info in Mobile */}
                    {!isLargerThanSm && (
                      <>
                        <Box px={4} py={2}>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            textTransform="capitalize"
                          >
                            {dataRedux.fullname}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.600"
                            textTransform="uppercase"
                          >
                            {dataRedux.jabatan}
                          </Text>
                        </Box>
                        <Divider my={2} />
                      </>
                    )}

                    {/* Menu Items */}
                    <MenuItem
                      icon={<Box>🚪</Box>}
                      onClick={handleLogout}
                      color="red.500"
                      fontWeight="medium"
                      _hover={{ bg: "red.50" }}
                    >
                      Keluar
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
        </Container>
      </Box>

      {/* Page Content */}
      <Outlet />
    </Box>
  );
};