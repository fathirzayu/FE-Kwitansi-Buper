import { Box, Flex, Stack, Tooltip, useDisclosure, IconButton, Container } from "@chakra-ui/react";
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
  const navigate = useNavigate();

  // Auth check - moved to top for clarity
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Action buttons configuration for easier maintenance
  const actionButtons = [
    {
      icon: PlusSquareIcon,
      label: "Tambah Mahasiswa",
      hoverColor: "red.400",
      onClick: addStudentModal.onOpen,
      ariaLabel: "Tambah mahasiswa baru",
    },
    {
      icon: EditIcon,
      label: "Buat Kwitansi",
      hoverColor: "green.400",
      onClick: kwitansiModal.onOpen,
      ariaLabel: "Buat kwitansi baru",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      hoverColor: "yellow.400",
      onClick: settingsModal.onOpen,
      ariaLabel: "Buka pengaturan",
    },
  ];

  return (
    <Box bgColor="blue.500" minH="100vh" w="100%">
      {/* Hero Section with Action Buttons */}
      <Container maxW="container.xl" py={8}>
        <Flex
          direction={{ base: "column", sm: "row", md: "row" }}
          wrap="wrap"
          justifyContent="center"
          alignItems="center"
          gap={{ base: 14, sm: 18, md: 20, lg: 24 }}
          minH="50vh"
          px={4}
        >
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Tooltip
                key={index}
                label={button.label}
                fontSize="xl"
                placement="top"
                hasArrow
                bg="gray.700"
                color="white"
              >
                <IconButton
                  icon={<Icon boxSize={{ base: 24, sm: 28, md: 32, lg: 40 }} />}
                  aria-label={button.ariaLabel}
                  variant="ghost"
                  size="lg"
                  color="white"
                  onClick={button.onClick}
                  _hover={{
                    color: button.hoverColor,
                    transform: "scale(1.1)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  _active={{
                    transform: "scale(0.95)",
                  }}
                  sx={{
                    "& > svg": {
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Flex>
      </Container>

      {/* Table Section */}
      <Box bgColor="white" borderTopRadius="3xl" shadow="xl">
        <Container maxW="container.xl" py={8}>
          <Stack spacing={6}>
            <TableKwitansi />
          </Stack>
        </Container>
      </Box>

      {/* Modals */}
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