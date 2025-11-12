import {
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  HStack,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, CalendarIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import "react-day-picker/dist/style.css";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginations } from "./pagination";
import { useSelector } from "react-redux";
import { handlePrint } from "../helper/handlePrint";
import SubmenuDatePicker from "../helper/datePicker";
import { formatDateLocal } from "../helper/formatDateLocal";
import { exportKwitansi, fetchKwitansi } from "../api/listEndpoint";
import { formatDateDDMMYYYY } from "../helper/formatDateDDMMYYYY";

export const TableKwitansi = () => {
  const user = useSelector((state) => state.user.value);
  const [dataKwitansi, setDataKwitansi] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingType, setLoadingType] = useState(null); // "excel" | "pdf" | null

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const sort = params.get("sort") || "tanggal_bayar";
  const order = params.get("order") || "desc";
  const page = parseInt(params.get("page") || 1);
  const limit = parseInt(params.get("limit") || 5);

  const startDate = params.get("startDate") || null;
  const endDate = params.get("endDate") || null;

  const fetchDataKwitansi = useCallback(async () => {
    try {
      const res = await fetchKwitansi({ search, sort, order, page, limit, startDate, endDate });
      setDataKwitansi(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  }, [search, sort, order, page, limit, startDate, endDate]);

  useEffect(() => {
    fetchDataKwitansi();
  }, [fetchDataKwitansi]);

  const handleSearch = (e) => {
    const value = e.target.value;
    params.set("search", value);
    params.set("page", 1);
    navigate({ search: params.toString() });
  };

  const handlePageChange = (newPage) => {
    params.set("page", newPage);
    navigate({ search: params.toString() });
  };

  const handleExport = async (type) => {
    setLoadingType(type);
    try {
      await exportKwitansi({ search, sort, order, startDate, endDate, type });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingType(null);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      setSelectedDate({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    } else {
      setSelectedDate(null);
    }
  }, [startDate, endDate]);

  const handleDateChange = (range) => {
    setSelectedDate(range);

    if (range?.from && range?.to) {
      const from = formatDateLocal(range.from);
      const to = formatDateLocal(range.to);
      params.set("startDate", from);
      params.set("endDate", to);
      params.set("page", 1);
      navigate({ search: params.toString() });
    } else {
      params.delete("startDate");
      params.delete("endDate");
      params.set("page", 1);
      navigate({ search: params.toString() });
    }
  };

  return (
    <Stack width="full" gap="5" p={5}>
      <Badge
        colorScheme="blue"
        alignSelf="flex-start"
        px={2}
        py={1}
        fontSize="2xl"
        borderRadius={"md"}
      >
        History Kwitansi
      </Badge>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
        {/* Search */}
        <InputGroup w={{ base: "100%", md: "300px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Cari NIM atau Nama..."
            defaultValue={search}
            onChange={handleSearch}
            borderRadius="md"
            borderWidth="2px"
            borderColor="blue.300"
            focusBorderColor="blue.500"
          />
        </InputGroup>

      <Flex gap={2} w={{ base: "100%", md: "auto" }}>
        {/* Filter tanggal pakai Popover */}
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              borderRadius="md"
              borderWidth="2px"
              borderColor="blue.300"
              minW="250px"
              justifyContent="flex-start"
            >
              <HStack justify="space-between" w="full">
                <HStack>
                  <CalendarIcon />
                  <span>
                    {selectedDate?.from && selectedDate?.to
                      ? `${selectedDate.from.toLocaleDateString("id-ID")} → ${selectedDate.to.toLocaleDateString("id-ID")}`
                      : "Pilih Rentang Tanggal"}
                  </span>
                </HStack>
                {selectedDate && (
                  <CloseIcon
                    boxSize={3}
                    color="red.400"
                    cursor="pointer"
                    onClick={() => {
                      setSelectedDate(null);
                      params.delete("startDate");
                      params.delete("endDate");
                      params.set("page", 1);
                      navigate({ search: params.toString() });
                    }}
                  />
                )}
              </HStack>
            </Button>
          </PopoverTrigger>

          <PopoverContent w="380px" maxW="95vw">
            <PopoverArrow />
            <PopoverBody>
              <SubmenuDatePicker
                selected={selectedDate}
                  onChange={handleDateChange}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Order By */}
        <Menu>
          <MenuButton
            as={Button}
            borderRadius="md"
            borderWidth="2px"
            borderColor="blue.300"
            rightIcon={<ChevronDownIcon />}
          >
            Order By: {sort}
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                params.set("sort", "nim");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              NIM
            </MenuItem>
            <MenuItem
              onClick={() => {
                params.set("sort", "nama");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              Nama
            </MenuItem>
            <MenuItem
              onClick={() => {
                params.set("sort", "angkatan");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              Angkatan
            </MenuItem>
            <MenuItem
              onClick={() => {
                params.set("sort", "tanggal_bayar");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              Tanggal Bayar
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Sort By */}
        <Menu>
          <MenuButton
            as={Button}
            borderRadius="md"
            borderWidth="2px"
            borderColor="blue.300"
            rightIcon={<ChevronDownIcon />}
          >
            Sort By: {order}
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                params.set("order", "asc");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              Ascending
            </MenuItem>
            <MenuItem
              onClick={() => {
                params.set("order", "desc");
                params.set("page", 1);
                navigate({ search: params.toString() });
              }}
            >
              Descending
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Export */}
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="blue"
            rightIcon={<ChevronDownIcon />}
            isLoading={!!loadingType}
            loadingText={`Exporting ${loadingType?.toUpperCase()}`}
          >
            Export
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleExport("excel")}>
              {loadingType === "excel" ? "Exporting Excel..." : "Excel"}
            </MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>
              {loadingType === "pdf" ? "Exporting PDF..." : "PDF"}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      </Flex>
      {/* Table */}
      <TableContainer border="1px" borderColor="blue.200" borderRadius="md">
        <Table size="sm" variant="simple" colorScheme="gray">
          <Thead bg="yellow">
            <Tr>
              <Th fontSize={"xl"} padding={4}>TANGGAL PEMBAYARAN</Th>
              <Th fontSize={"xl"} padding={4}>NIM</Th>
              <Th fontSize={"xl"} padding={4}>NAMA MHS</Th>
              <Th fontSize={"xl"} padding={4}>ANGKATAN</Th>
              <Th fontSize={"xl"} padding={4}>JENIS BAYAR</Th>
              <Th fontSize={"xl"} padding={4}>CARA BAYAR</Th>
              <Th fontSize={"xl"} padding={4}>KETERANGAN BAYAR</Th>
              <Th fontSize={"xl"} padding={4}>TANGGAL CETAKAN</Th>
              <Th fontSize={"xl"} padding={4}>ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataKwitansi.map((item) => (
              <Tr key={item.id}>
                <Td>{formatDateDDMMYYYY(item.tanggal_bayar)}</Td>
                <Td isNumeric>{item.nim}</Td>
                <Td>{item.nama}</Td>
                <Td isNumeric>{item.angkatan}</Td>
                <Td>{item.jenis_bayar}</Td>
                <Td>{item.cara_bayar}</Td>
                <Td>{item.keterangan_bayar}</Td>
                <Td>
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handlePrint(item, user)}
                  >
                    Print
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Paginations
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
};
