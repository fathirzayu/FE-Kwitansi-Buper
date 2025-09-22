import { Box, Flex, Stack, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ModalAddStudent } from "../components/modal/modalAddStudent";
import { ModalKwitansi } from "../components/modal/modalKwitansi";
import { ModalSettings } from "../components/modal/modalSettings";
import { EditIcon, PlusSquareIcon, SettingsIcon } from "@chakra-ui/icons";
import { TableKwitansi } from "../components/tableKwitansi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const addStudentModal = useDisclosure();
  const kwitansiModal = useDisclosure();
  const settingsModal = useDisclosure();
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Box bgColor={"blue.500"} minH="100vh" w="100%" >
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        gap={40}
        minH="60vh"
        p={4}
      >
        {/* Modal Add Student */}
        <Tooltip label='Tambah Mahasiswa' fontSize='xl' placement="top" hasArrow>
          <PlusSquareIcon 
            boxSize={40}
            color={"white"}
            cursor="pointer"
            onClick={addStudentModal.onOpen}
            _hover={{ color: "red", transform: "scale(1.2)", transition: "0.2s" }}
          />
        </Tooltip>

        {/* Modal Kwitansi */}
        <Tooltip label='Buat Kwitansi' fontSize='xl' placement="top" hasArrow>
          <EditIcon 
            boxSize={40}
            color={"white"}
            cursor="pointer"
            onClick={kwitansiModal.onOpen}
            _hover={{ color: "green", transform: "scale(1.2)", transition: "0.2s" }}
          />
        </Tooltip>

        {/* Settings */}
        <Tooltip label='Settings' fontSize='xl' placement="top" hasArrow>
          <SettingsIcon 
            boxSize={40}
            color={"white"}
            cursor="pointer"
            onClick={settingsModal.onOpen}
            _hover={{ color: "yellow", transform: "scale(1.2)", transition: "0.2s" }}
          />
        </Tooltip>
      </Flex>

      <Stack bgColor={"white"} gap="5" p={5}>
        <TableKwitansi/>
      </Stack>

      <ModalAddStudent
        isOpen={addStudentModal.isOpen}
        onClose={addStudentModal.onClose}
      />
      <ModalKwitansi
        isOpen={kwitansiModal.isOpen}
        onClose={kwitansiModal.onClose}
      />
      <ModalSettings
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
      />
    </Box>
  );
};
