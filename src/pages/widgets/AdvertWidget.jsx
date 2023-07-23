import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { host } from "../../utils/APIRoutes";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`${host}/assets/Shopee.jpg`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Shopee</Typography>
        <Typography color={medium}>shopee.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Super shopping day
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
