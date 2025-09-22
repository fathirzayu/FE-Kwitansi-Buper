import { Box, Button, HStack, Text } from "@chakra-ui/react";

export const Paginations = ({ totalPages = 1, currentPage = 1, onPageChange }) => {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <Box textAlign="center" p={4}>
      <HStack spacing={2} justify="center">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          isDisabled={currentPage === 1}
          colorScheme="blue"
          size="sm"
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            colorScheme={currentPage === index + 1 ? "blue" : "gray"}
            variant={currentPage === index + 1 ? "solid" : "outline"}
            size="sm"
          >
            {index + 1}
          </Button>
        ))}

        <Button
          onClick={() => goToPage(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          colorScheme="blue"
          size="sm"
        >
          Next
        </Button>
      </HStack>
    </Box>
  )
}
