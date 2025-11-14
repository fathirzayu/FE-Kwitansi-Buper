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
  Text,
  Skeleton,
  useToast,
  Box,
  Heading,
} from "@chakra-ui/react";
import {
  SearchIcon,
  CalendarIcon,
  CloseIcon,
  ChevronDownIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
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
  const [totalData, setTotalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const sort = params.get("sort") || "tanggal_bayar";
  const order = params.get("order") || "desc";
  const page = parseInt(params.get("page") || 1);
  const limit = parseInt(params.get("limit") || 10);

  const startDate = params.get("startDate") || null;
  const endDate = params.get("endDate") || null;

  // Sort options configuration
  const sortOptions = [
    { value: "nim", label: "NIM" },
    { value: "nama", label: "Nama" },
    { value: "angkatan", label: "Angkatan" },
    { value: "tanggal_bayar", label: "Tanggal Bayar" },
  ];

  const orderOptions = [
    { value: "asc", label: "Ascending (A-Z)" },
    { value: "desc", label: "Descending (Z-A)" },
  ];

  const fetchDataKwitansi = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchKwitansi({
        search,
        sort,
        order,
        page,
        limit,
        startDate,
        endDate,
      });
      setDataKwitansi(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      setTotalData(res?.totalData)
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal memuat data kwitansi",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, sort, order, page, limit, startDate, endDate, toast]);

  useEffect(() => {
    fetchDataKwitansi();
  }, [fetchDataKwitansi]);

  const handleSearch = (e) => {
    const value = e.target.value;
    params.set("search", value);
    params.set("page", "1");
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
      toast({
        title: "Berhasil",
        description: `File ${type.toUpperCase()} berhasil diunduh`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: `Gagal mengunduh file ${type.toUpperCase()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
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
      params.set("page", "1");
      navigate({ search: params.toString() });
    } else {
      params.delete("startDate");
      params.delete("endDate");
      params.set("page", "1");
      navigate({ search: params.toString() });
    }
  };

  const clearDateFilter = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    params.delete("startDate");
    params.delete("endDate");
    params.set("page", "1");
    navigate({ search: params.toString() });
  };

  const updateSort = (field) => {
    params.set("sort", field);
    params.set("page", "1");
    navigate({ search: params.toString() });
  };

  const updateOrder = (newOrder) => {
    params.set("order", newOrder);
    params.set("page", "1");
    navigate({ search: params.toString() });
  };

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sort);
    return option?.label || sort;
  };

  // const getOrderLabel = () => {
  //   const option = orderOptions.find((opt) => opt.value === order);
  //   return option?.label || order;
  // };

  return (
    <Stack width="full" spacing={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Heading size="lg" color="blue.600">
          Riwayat Kwitansi
        </Heading>
        <Badge
          colorScheme="blue"
          px={4}
          py={2}
          fontSize="md"
          borderRadius="full"
        >
          Total: {dataKwitansi.length} dari {totalData} data
        </Badge>
      </Flex>

      {/* Filters */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align={{ base: "stretch", lg: "center" }}
        gap={3}
      >
        {/* Search */}
        <InputGroup maxW={{ base: "100%", lg: "400px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Cari NIM atau Nama mahasiswa..."
            defaultValue={search}
            onChange={handleSearch}
            borderRadius="lg"
            borderWidth="2px"
            borderColor="blue.200"
            focusBorderColor="blue.500"
            bg="white"
            _hover={{ borderColor: "blue.300" }}
          />
        </InputGroup>

        {/* Filter Controls */}
        <Flex gap={2} flexWrap="wrap">
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                borderRadius="lg"
                borderWidth="2px"
                borderColor="blue.200"
                minW={{ base: "100%", sm: "250px" }}
                justifyContent="space-between"
                _hover={{ borderColor: "blue.300", bg: "blue.50" }}
              >
                <HStack spacing={2}>
                  <CalendarIcon />
                  <Text fontSize="sm" noOfLines={1}>
                    {selectedDate?.from && selectedDate?.to
                      ? `${selectedDate.from.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })} - ${selectedDate.to.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}`
                      : "Pilih Tanggal"}
                  </Text>
                </HStack>
                {selectedDate && (
                  <CloseIcon
                    boxSize={3}
                    color="red.500"
                    onClick={clearDateFilter}
                    _hover={{ color: "red.600" }}
                  />
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent w="auto" maxW="95vw">
              <PopoverArrow />
              <PopoverBody p={4}>
                <SubmenuDatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Sort Field */}
          <Menu>
            <MenuButton
              as={Button}
              borderRadius="lg"
              borderWidth="2px"
              borderColor="blue.200"
              rightIcon={<ChevronDownIcon />}
              _hover={{ borderColor: "blue.300", bg: "blue.50" }}
              minW="150px"
            >
              <Text fontSize="sm" noOfLines={1}>
                Urutkan: {getSortLabel()}
              </Text>
            </MenuButton>
            <MenuList>
              {sortOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => updateSort(option.value)}
                  bg={sort === option.value ? "blue.50" : "transparent"}
                  fontWeight={sort === option.value ? "bold" : "normal"}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Sort Order */}
          <Menu>
            <MenuButton
              as={Button}
              borderRadius="lg"
              borderWidth="2px"
              borderColor="blue.200"
              rightIcon={<ChevronDownIcon />}
              _hover={{ borderColor: "blue.300", bg: "blue.50" }}
              minW="150px"
            >
              <Text fontSize="sm" noOfLines={1}>
                {order === "asc" ? "A → Z" : "Z → A"}
              </Text>
            </MenuButton>
            <MenuList>
              {orderOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => updateOrder(option.value)}
                  bg={order === option.value ? "blue.50" : "transparent"}
                  fontWeight={order === option.value ? "bold" : "normal"}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Export */}
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="blue"
              rightIcon={loadingType ? undefined : <DownloadIcon />}
              isLoading={!!loadingType}
              loadingText={`Mengunduh...`}
              borderRadius="lg"
              minW="120px"
            >
              Export
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<Box>📊</Box>}
                onClick={() => handleExport("excel")}
                isDisabled={!!loadingType}
              >
                Excel (.xlsx)
              </MenuItem>
              <MenuItem
                icon={<Box>📄</Box>}
                onClick={() => handleExport("pdf")}
                isDisabled={!!loadingType}
              >
                PDF (.pdf)
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Table */}
      <TableContainer
        border="2px"
        borderColor="blue.200"
        borderRadius="xl"
        bg="white"
        boxShadow="sm"
        overflowX="auto"
      >
        <Table variant="simple" size="sm">
          <Thead bg="yellow.400">
            <Tr>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
                py={4}
              >
                Tanggal Bayar
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
                isNumeric
              >
                NIM
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
              >
                Nama Mahasiswa
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
                isNumeric
              >
                Angkatan
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
              >
                Jenis Bayar
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
              >
                Cara Bayar
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
              >
                Keterangan
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
              >
                Tgl Cetak
              </Th>
              <Th
                fontSize="sm"
                textTransform="uppercase"
                color="blue.700"
                fontWeight="bold"
                textAlign="center"
              >
                Aksi
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <Tr key={index}>
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <Td key={colIndex}>
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : dataKwitansi.length === 0 ? (
              // Empty state
              <Tr>
                <Td colSpan={9} textAlign="center" py={10}>
                  <Text color="gray.500" fontSize="lg">
                    Tidak ada data kwitansi
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    Coba ubah filter pencarian Anda
                  </Text>
                </Td>
              </Tr>
            ) : (
              // Data rows
              dataKwitansi.map((item, index) => (
                <Tr
                  key={item.id}
                  _hover={{ bg: "blue.50" }}
                  transition="background 0.2s"
                  bg={index % 2 === 0 ? "white" : "gray.50"}
                >
                  <Td fontWeight="medium">
                    {formatDateDDMMYYYY(item.tanggal_bayar)}
                  </Td>
                  <Td isNumeric fontFamily="mono" fontWeight="semibold">
                    {item.nim}
                  </Td>
                  <Td>{item.nama}</Td>
                  <Td isNumeric fontWeight="medium">
                    {item.angkatan}
                  </Td>
                  <Td>
                    <Badge colorScheme="purple" fontSize="xs">
                      {item.jenis_bayar}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="teal" fontSize="xs">
                      {item.cara_bayar}
                    </Badge>
                  </Td>
                  <Td maxW="200px" isTruncated>
                    {item.keterangan_bayar}
                  </Td>
                  <Td fontSize="sm" color="gray.600">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handlePrint(item, user)}
                      borderRadius="md"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="transform 0.2s"
                    >
                      🖨️ Print
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>


      {/* Pagination */}
      {!isLoading && dataKwitansi.length > 0 && (
        <Paginations
          totalPages={totalPages}
          totalData={totalData}
          currentPage={page}
          onPageChange={handlePageChange}
          showPageSize={true}
          pageSize={limit}
          onPageSizeChange={(newLimit) => {
            params.set("limit", newLimit);
            params.set("page", "1");
            navigate({ search: params.toString() });
          }}
          totalItems={totalPages * limit}
        />
      )}
    </Stack>
  );
};