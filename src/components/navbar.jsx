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
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAvatarUrl } from "../api/listEndpoint";

export const Navbar = () => {
  const dataRedux = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLargerThanSm] = useMediaQuery("(min-width: 30em)");

  const onLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Goodbye!",
      description: "See you again!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        bg="yellow"
        color="white"
        top={0}
        left={0}
        width="100%"
        zIndex={999}
        direction="row"
        flexWrap="wrap"
      >
        <Flex align="center" gap={3}>
          <Image
            src="/buper.png"
            alt="Logo"
            boxSize="60px"
            borderRadius="full"
          />
          <Text
            fontWeight="bold"
            fontSize={{ base: "3xl", md: "3xl" }} 
            color="blue.500"
          >
            STIE BUDI PERTIWI
          </Text>
        </Flex>

        {/* Bagian kanan user menu */}
        <Menu>
          <MenuButton>
            <Flex>
              <Tag
                size={isLargerThanSm ? "lg" : "md"}
                borderRadius="full"
                p={isLargerThanSm ? "6px" : "4px"}
                pr={5}
                _hover={{ colorScheme: "blue" }}
                _focus={{ boxShadow: "outline" }}
              >
                <Avatar
                  src={getAvatarUrl(dataRedux.imgProfile)}
                  size="md"
                />
                {isLargerThanSm && (
                  <Box ml="3" justifyItems={"start"}>
                    <Text fontWeight="bold" textTransform="capitalize">
                      {dataRedux.fullname}
                    </Text>
                    <Text fontSize="sm" textTransform="uppercase">
                      {dataRedux.jabatan}
                    </Text>
                  </Box>
                )}
              </Tag>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onLogout} color={"red"}>
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Outlet />
    </Box>
  );
};
