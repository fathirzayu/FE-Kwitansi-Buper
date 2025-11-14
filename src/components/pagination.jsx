import { Box, Button, HStack, Text, Select, Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

export const Paginations = ({ 
  totalPages = 1, 
  currentPage = 1, 
  onPageChange,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  totalItems = 0,
  totalData
}) => {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Calculate page numbers to display with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate items range
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageSizeOptions = [5, 10, 20, 50, 100];

  return (
    <Box py={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
      >
        {/* Items info and page size selector */}
        <Flex
          align="center"
          gap={4}
          direction={{ base: "column", sm: "row" }}
          width={{ base: "100%", md: "auto" }}
        >
          {totalItems > 0 && (
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              Menampilkan {startItem}-{endItem} dari {totalData} data
            </Text>
          )}

          {showPageSize && onPageSizeChange && (
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
                Tampilkan:
              </Text>
              <Select
                size="sm"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                width="80px"
                borderRadius="md"
                borderWidth="2px"
                focusBorderColor="blue.500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </Flex>
          )}
        </Flex>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <HStack spacing={2}>
            {/* First page button */}
            <IconButton
              icon={<ArrowLeftIcon />}
              onClick={() => goToPage(1)}
              isDisabled={currentPage === 1}
              variant="outline"
              colorScheme="blue"
              size="sm"
              aria-label="Halaman pertama"
              display={{ base: "none", sm: "inline-flex" }}
            />

            {/* Previous button */}
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => goToPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              variant="outline"
              colorScheme="blue"
              size="sm"
            >
              <Text display={{ base: "none", sm: "inline" }}>Sebelumnya</Text>
            </Button>

            {/* Page numbers */}
            <HStack spacing={1} display={{ base: "none", md: "flex" }}>
              {pageNumbers.map((page, index) => {
                if (page === "ellipsis-start" || page === "ellipsis-end") {
                  return (
                    <Button
                      key={`ellipsis-${index}`}
                      variant="ghost"
                      size="sm"
                      isDisabled
                      cursor="default"
                      _hover={{ bg: "transparent" }}
                    >
                      ...
                    </Button>
                  );
                }

                return (
                  <Button
                    key={page}
                    onClick={() => goToPage(page)}
                    colorScheme={currentPage === page ? "blue" : "gray"}
                    variant={currentPage === page ? "solid" : "outline"}
                    size="sm"
                    minW="40px"
                    fontWeight={currentPage === page ? "bold" : "normal"}
                    _hover={{
                      transform: currentPage === page ? "none" : "translateY(-2px)",
                      boxShadow: currentPage === page ? "none" : "sm",
                    }}
                    transition="all 0.2s"
                  >
                    {page}
                  </Button>
                );
              })}
            </HStack>

            {/* Current page indicator for mobile */}
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="blue.600"
              px={3}
              display={{ base: "inline", md: "none" }}
            >
              {currentPage} / {totalPages}
            </Text>

            {/* Next button */}
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => goToPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              variant="outline"
              colorScheme="blue"
              size="sm"
            >
              <Text display={{ base: "none", sm: "inline" }}>Selanjutnya</Text>
            </Button>

            {/* Last page button */}
            <IconButton
              icon={<ArrowRightIcon />}
              onClick={() => goToPage(totalPages)}
              isDisabled={currentPage === totalPages}
              variant="outline"
              colorScheme="blue"
              size="sm"
              aria-label="Halaman terakhir"
              display={{ base: "none", sm: "inline-flex" }}
            />
          </HStack>
        )}
      </Flex>
    </Box>
  );
};