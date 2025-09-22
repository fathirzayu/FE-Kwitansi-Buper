import { Avatar, Box, Center, useMediaQuery } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ModalAddAvatar } from "./modal/modalAddAvatar";
import { getAvatarUrl } from "../api/listEndpoint";

export const ImageProfile = () => {
  const dataRedux = useSelector((state) => state.user.value);
  console.log('>>avatar', dataRedux);
  
  const [isLargerThanSm] = useMediaQuery("(min-width: 30em)"); 

  return (
    <Box>
      <Center mt={3}>
        <Avatar 
          src={getAvatarUrl(dataRedux.imgProfile)} 
          size={isLargerThanSm ? "2xl" : "xl"} 
        />
      </Center>
      <Center mt={3}>
        <ModalAddAvatar />
      </Center>
    </Box>
  );
};
